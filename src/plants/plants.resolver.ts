import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {PlantsService} from './plants.service';
import {AuthGuard} from "../auth/auth.guard";
import {UseGuards} from "@nestjs/common";
import {User} from "../decorators";
import {
    CheckPairingProcessResponse,
    Measurement,
    Plant,
    RemovePlantResponse,
    Room
} from "../graphql.schema";
import {PairPlantDto, UpdatePlantDto} from "./dto/plant.dto";
import {MeasurementsService} from "../measurements/measurements.service";
import {RoomsService} from "../rooms/rooms.service";
import {SchedulerRegistry} from "@nestjs/schedule";

@Resolver('Plant')
@UseGuards(AuthGuard)
export class PlantsResolver {
    constructor(private readonly plantsService: PlantsService,
                private readonly measurementsService: MeasurementsService,
                private readonly roomsService: RoomsService,
                private readonly schedulerRegistry: SchedulerRegistry) {
    }

    getTimeoutKey(plantId: string) {
        return `pairing-${plantId}`;
    }

    static isDeviceOnline(lastHeartbeat: Date): boolean {
        return lastHeartbeat && lastHeartbeat.getTime() > Date.now() - 15 * 60 * 1000;
    }

    @ResolveField('measurements')
    async getMeasurements(@Parent() plant: Plant): Promise<Measurement[]> {
        const measurements = await this.measurementsService.getMeasurements({plantId: plant.id});

        const dtoOut = measurements.map(measurement => {
            return {
                id: measurement.id,
                value: measurement.value,
                date: measurement.createdAt.toISOString(),
            }
        });

        return dtoOut;
    }

    @ResolveField('room')
    async getRoom(@Parent() plant: Plant): Promise<Room> {
        const room = await this.roomsService.getRoomByPlantId(plant.id);

        return room;
    }

    @Query('plants')
    async getPlants(@User() user: JWTUser): Promise<Plant[]> {
        const plants = await this.plantsService.findAllForUser(user.uuid);

        const dtoOut = plants.map(plant => {
            return {
                id: plant.id,
                name: plant.name,
                imageUrl: plant.imageUrl,
                description: plant.description,
                type: plant.type,
                lastHeartbeat: plant.lastHeartbeat?.toISOString(),
                isOnline: PlantsResolver.isDeviceOnline(plant.lastHeartbeat)
            }
        });

        return dtoOut;
    }

    @Query('plant')
    async getPlant(@Args('id') id: string, @User() user: JWTUser): Promise<Plant> {
        const plant = await this.plantsService.findOne(id, user.uuid);

        return {
            id: plant.id,
            name: plant.name,
            imageUrl: plant.imageUrl,
            description: plant.description,
            type: plant.type,
            lastHeartbeat: plant.lastHeartbeat?.toISOString(),
            isOnline: PlantsResolver.isDeviceOnline(plant.lastHeartbeat)
        };
    }

   @Query("checkPairingProcess")
   async checkPairingProcesss(@Args('pairingCode') pairingCode: string): Promise<CheckPairingProcessResponse> {
         const pairingPlant = await this.plantsService.checkPairingProcess(pairingCode);

         if(pairingPlant.userPaired && pairingPlant.paired) {
             try {
                 this.schedulerRegistry.deleteTimeout(this.getTimeoutKey(pairingPlant.id));
             } catch (e) {
                 console.error(e);
             }
         }

         return {
              userPaired: pairingPlant.userPaired,
              serverPaired: pairingPlant.paired,
              plantId: pairingPlant.id
         };
   }

    @Mutation('pairPlant')
    async pairPlant(@Args('pairPlantInput') pairPlantDto: PairPlantDto, @User() user: JWTUser): Promise<Plant> {
        const plant = await this.plantsService.pair(pairPlantDto, user.uuid);

        // Timeout of the pairing process - start
        const timeout = setTimeout(() => this.plantsService.stopPairingProcess(plant.id), 120000);

        // Timeout exists, delete it
        if(this.schedulerRegistry.doesExist("timeout", this.getTimeoutKey(plant.id))) {
            try {
                this.schedulerRegistry.deleteTimeout(this.getTimeoutKey(plant.id));
            } catch (e) {
                console.error(e);
            }
        }

        this.schedulerRegistry.addTimeout(this.getTimeoutKey(plant.id), timeout);

        return {
            id: plant.id,
            name: plant.name,
            imageUrl: plant.imageUrl,
            description: plant.description,
            type: plant.type,
            lastHeartbeat: plant.lastHeartbeat?.toISOString(),
            isOnline: PlantsResolver.isDeviceOnline(plant.lastHeartbeat)
        };
    }

    @Mutation('updatePlant')
    async updatePlant(@Args('updatePlantInput') updatePlantInput: UpdatePlantDto, @User() user: JWTUser): Promise<Plant> {
        const plant = await this.plantsService.update(updatePlantInput, user.uuid);

        return {
            id: plant.id,
            imageUrl: plant.imageUrl,
            name: plant.name,
            description: plant.description,
            type: plant.type,
            lastHeartbeat: plant.lastHeartbeat?.toISOString(),
            isOnline: PlantsResolver.isDeviceOnline(plant.lastHeartbeat)
        };
    }

    @Mutation('removePlant')
    async removePlant(@Args('id') id: string, @User() user: JWTUser): Promise<RemovePlantResponse> {
        let plant = await this.plantsService.unpair(id, user.uuid);
        return {
            id: plant.id,
            name: plant.name,
            unpaired: true
        };
    }
}
