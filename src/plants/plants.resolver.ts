import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {PlantsService} from './plants.service';
import {AuthGuard} from "../auth/auth.guard";
import {UseGuards} from "@nestjs/common";
import {User} from "../decorators";
import {Measurement, Plant, RemovePlantResponse, Room} from "../graphql.schema";
import {PairPlantDto, UpdatePlantDto} from "./dto/plant.dto";
import {MeasurementsService} from "../measurements/measurements.service";
import {RoomsService} from "../rooms/rooms.service";

@Resolver('Plant')
@UseGuards(AuthGuard)
export class PlantsResolver {
    constructor(private readonly plantsService: PlantsService,
                private readonly measurementsService: MeasurementsService,
                private readonly roomsService: RoomsService) {
    }

    @ResolveField('measurements')
    async getMeasurements(@Parent() plant: Plant): Promise<Measurement[]> {
        const measurements = await this.measurementsService.getMeasurements(plant.id);

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
                type: plant.type,
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
            type: plant.type,
        };
    }

    @Mutation('pairPlant')
    async pairPlant(@Args('createPlantInput') pairPlantDto: PairPlantDto, @User() user: JWTUser): Promise<Plant> {
        const plant = await this.plantsService.pair(pairPlantDto, user.uuid);

        return {
            id: plant.id,
            name: plant.name,
            type: plant.type,
        };
    }

    @Mutation('updatePlant')
    async updatePlant(@Args('updatePlantInput') updatePlantInput: UpdatePlantDto, @User() user: JWTUser): Promise<Plant> {
        const plant = await this.plantsService.update(updatePlantInput, user.uuid);

        return {
            id: plant.id,
            name: plant.name,
            type: plant.type,
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