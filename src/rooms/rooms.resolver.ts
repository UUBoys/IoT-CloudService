import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {RoomsService} from './rooms.service';
import {User} from "../decorators";
import {Plant, Room} from "../graphql.schema";
import {AuthGuard} from "../auth/auth.guard";
import {UseGuards} from "@nestjs/common";
import {PlantsService} from "../plants/plants.service";
import {
    AddPlantsToRoomDto,
    CreateRoomDto, JoinRoomDto,
    RemovePlantsFromRoomDto,
    UpdateRoomDto
} from "./dto/room.dto";
import {PlantsResolver} from "../plants/plants.resolver";

@Resolver('Room')
@UseGuards(AuthGuard)
export class RoomsResolver {
    constructor(private readonly roomsService: RoomsService,
                private readonly plantsService: PlantsService) {
    }

    @ResolveField('plants')
    async getPlants(@Parent() room: Room): Promise<Plant[]> {
        const plants = await this.plantsService.findByRoomId(room.id);

        return plants.map(plant => {
            return {
                id: plant.id,
                name: plant.name,
                type: plant.type,
                lastHeartbeat: plant.lastHeartbeat?.toISOString(),
                imageUrl: plant.imageUrl,
                description: plant.description,
                isOnline: PlantsResolver.isDeviceOnline(plant.lastHeartbeat),
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
                    inviteCode: user.uuid == room.ownerId ? room.inviteCode : undefined,
                }
        });
    }

    @Query('room')
    async getRoom(@Args('id') id: string, @User() user: JWTUser): Promise<Room> {
        const room = await this.roomsService.getRoomById(id, user.uuid);

        return {
            id: room.id,
            inviteCode: room.inviteCode,
            name: room.name,
        }
    }

    @Mutation('createRoom')
    async createRoom(@Args('room') room: CreateRoomDto, @User() user: JWTUser): Promise<Room> {
        const roomResponse = await this.roomsService.createRoom(room, user.uuid);

        return {
            id: roomResponse.id,
            inviteCode: roomResponse.inviteCode,
            name: roomResponse.name
        }
    }

    @Mutation('addPlantsToRoom')
    async addPlantsToRoom(@Args('addPlants') addPlantsDto: AddPlantsToRoomDto, @User() user: JWTUser): Promise<Room> {
        const plantIds = addPlantsDto.plants.map(plant => plant.plantId);

        const room = await this.roomsService.addPlantsToRoom(addPlantsDto.roomId, plantIds, user.uuid);

        return {
            id: room.id,
            inviteCode: room.inviteCode,
            name: room.name,
        }
    }

    @Mutation('removePlantsFromRoom')
    async removePlantsFromRoom(@Args('removePlants') removePlantsDto: RemovePlantsFromRoomDto, @User() user: JWTUser): Promise<Room> {
        const plantIds = removePlantsDto.plants.map(plant => plant.plantId);

        const room = await this.roomsService.removePlantsFromRoom(removePlantsDto.roomId, plantIds, user.uuid);

        return {
            id: room.id,
            inviteCode: room.inviteCode,
            name: room.name,
        }
    }

    @Mutation('deleteRoom')
    async deleteRoom(@Args('roomId') roomId: string, @User() user: JWTUser): Promise<Room> {
        const room = await this.roomsService.deleteRoom(roomId, user.uuid);

        return {
            id: room.id,
            inviteCode: room.inviteCode,
            name: room.name,
        }
    }

    @Mutation('joinRoom')
    async joinRoom(@Args('joinRoom') joinRoomDto: JoinRoomDto, @User() user: JWTUser): Promise<boolean> {
        await this.roomsService.addUserToRoom(user.uuid, joinRoomDto.inviteCode);

        return true;
    }

    @Mutation('updateRoom')
    async updateRoom(@Args('roomUpdate') roomUpdateDto: UpdateRoomDto, @User() user: JWTUser): Promise<Room> {
        const room = await this.roomsService.updateRoom(roomUpdateDto, user.uuid);

        return {
            id: room.id,
            inviteCode: room.inviteCode,
            name: room.name,
        }
    }
}
