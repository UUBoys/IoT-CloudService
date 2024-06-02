import {Injectable, NotFoundException} from '@nestjs/common';
import {prisma} from "../util/db/client";
import {CreateRoomDto} from "./dto/room.dto";
import crypto from "crypto";

@Injectable()
export class RoomsService {
    getRoomById(roomId: string, userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId,
                users: {
                    some: {
                        userId: userId
                    }
                }
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return room;
    }

    getRoomByPlantId(plantId: string) {
        const room = prisma.room.findFirst({
            where: {
                plants: {
                    some: {
                        id: plantId,
                    }
                },
            }
        });

        return room;
    }

    getRoomsByUserId(userId: string) {
        return prisma.room.findMany({
            where: {
                users: {
                    some: {
                        userId: userId
                    }
                }
            }
        })
    }

    async createRoom(dto: CreateRoomDto, userId: string) {
        let inviteCode = crypto.randomBytes(32).toString("hex");

        const room = await prisma.room.create({
            data: {
                name: dto.name,
                ownerId: userId,
                inviteCode: inviteCode,
                plants: (dto.plants && dto.plants.length > 0) ? {
                    connect: dto.plants.map(plant => {
                        return {
                            id: plant.plantId,
                            ownerId: userId
                        }
                    })
                } : undefined,
            },
        });

        const user = await prisma.roomUsers.create({
            data: {
                userId: userId,
                roomId: room.id
            }
        });

        return room;
    }

    deleteRoom(roomId: string, userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId,
                ownerId: userId
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return prisma.room.delete({
            where: {
                id: roomId
            }
        });
    }

    addPlantsToRoom(roomId: string, plantIds: string[], userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId,
                ownerId: userId
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return prisma.room.update({
            where: {
                id: roomId
            },
            data: {
                plants: {
                    connect: plantIds.map(id => {
                        return {
                            id: id,
                            ownerId: userId
                        }
                    })
                }
            }
        });
    }

    removePlantsFromRoom(roomId: string, plantIds: string[], userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId,
                ownerId: userId
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return prisma.room.update({
            where: {
                id: roomId
            },
            data: {
                plants: {
                    disconnect: plantIds.map(id => {
                        return {
                            id: id,
                            ownerId: userId
                        }
                    })
                }
            }
        });
    }

    addUserToRoom(roomId: string, userId: string, addingUserEmail: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId, ownerId: userId
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found/You are not the owner');
        }

        const user = prisma.user.findFirst({
            where: {
                email: addingUserEmail
            }
        });

        if (!user) {
            throw new NotFoundException('Adding user not found');
        }

        return prisma.roomUsers.create({
            data: {
                userId: userId,
                roomId: roomId
            }
        });
    }
}
