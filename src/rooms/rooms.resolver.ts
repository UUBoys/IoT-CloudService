import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import {User} from "../decorators";import {IMutation, IQuery, Plant, Room} from "../graphql.schema";
import {AuthGuard} from "../auth/auth.guard";
import {Body, UseGuards} from "@nestjs/common";
import {PlantsService} from "../plants/plants.service";
import {AddPlantsToRoomDto, RemovePlantsFromRoomDto} from "./dto/room.dto";

@Resolver('Room')
@UseGuards(AuthGuard)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService,
              private readonly plantsService: PlantsService) {}

  @ResolveField('plants')
    async getPlants(@Parent() room: Room, @User() user: JWTUser): Promise<Plant[]> {
        const plants = await this.plantsService.findByRoomId(room.id, user.uuid);

        return plants.map(plant => {
            return {
                id: plant.id,
                name: plant.name,
                type: plant.type,
            }
        });
    }

  @Query('rooms')
    async rooms(@User() user: JWTUser): Promise<Room[]> {
        let rooms = await this.roomsService.getRoomsByUserId(user.uuid);

        return rooms.map(room => {
            return {
                id: room.id,
                name: room.name,
            }
        });
    }

  @Query('room')
    async getRoom(@Args('id') id: string, @User() user: JWTUser): Promise<Room> {
        const room = await this.roomsService.getRoomById(id, user.uuid);

        return {
            id: room.id,
            name: room.name,
        }
    }

    @Mutation('createRoom')
    async createRoom(@Args('name') name: string, @User() user: JWTUser): Promise<Room> {
        const room = await this.roomsService.createRoom(name, user.uuid);

        return {
            id: room.id,
            name: room.name,
        }
    }

    @Mutation('addPlantsToRoom')
    async addPlantsToRoom(@Body() addPlantsDto: AddPlantsToRoomDto, @User() user: JWTUser): Promise<Room> {
        const plantIds = addPlantsDto.plants.map(plant => plant.plantId);

        const room = await this.roomsService.addPlantsToRoom(addPlantsDto.roomId, plantIds, user.uuid);

        return {
            id: room.id,
            name: room.name,
        }
    }

    @Mutation('removePlantsFromRoom')
    async removePlantsFromRoom(@Body() removePlantsDto: RemovePlantsFromRoomDto, @User() user: JWTUser): Promise<Room> {
        const plantIds = removePlantsDto.plants.map(plant => plant.plantId);

        const room = await this.roomsService.removePlantsFromRoom(removePlantsDto.roomId, plantIds, user.uuid);

        return {
            id: room.id,
            name: room.name,
        }
    }

    @Mutation('deleteRoom')
    async deleteRoom(@Args('roomId') roomId: string, @User() user: JWTUser): Promise<Room> {
        const room = await this.roomsService.deleteRoom(roomId, user.uuid);

        return {
            id: room.id,
            name: room.name,
        }
    }
}
