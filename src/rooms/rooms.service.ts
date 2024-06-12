import {Injectable, NotFoundException} from '@nestjs/common';
import {prisma} from "../util/db/client";
import {CreateRoomDto, UpdateRoomDto} from "./dto/room.dto";
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
        const rooms = prisma.room.findMany({
            where: {
                users: {
                    some: {
                        userId: userId
                    }
                }
            }
        });

        return rooms;
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

    async deleteRoom(roomId: string, userId: string) {
        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                ownerId: userId
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found/Not authorized to delete room');
        }

        // unlink plants from room
        await prisma.room.update({
            where: {
                id: roomId
            },
            data: {
                plants: {
                    set: []
                }
            }
        });

        return prisma.room.delete({
            where: {
                id: roomId
            },
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

    async addUserToRoom(userId: string, inviteCode: string) {
        const room = await prisma.room.findFirst({
            where: {
                inviteCode: inviteCode
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found/wrong invite code');
        }

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new NotFoundException('Adding user not found');
        }

        return prisma.roomUsers.create({
            data: {
                userId: userId,
                roomId: room.id
            }
        });
    }

    async updateRoom(dto: UpdateRoomDto, userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: dto.roomId,
                ownerId: userId
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return prisma.room.update({
            where: {
                id: dto.roomId
            },
            data: {
                name: dto.name
            }
        });
    }
}
