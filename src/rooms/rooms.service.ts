import {Injectable, NotFoundException} from '@nestjs/common';
import {prisma} from "../util/db/client";

@Injectable()
export class RoomsService {
    getRoomById(roomId: string, userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId,
                ownerId: userId
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
                        id: plantId
                    }
                }
            }
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return room;
    }

    getRoomsByUserId(userId: string) {
        return prisma.room.findMany({
            where: {
                ownerId: userId
            }
        })
    }

    createRoom(name: string, userId: string) {
        return prisma.room.create({
            data: {
                name: name,
                ownerId: userId
            }
        });
    }

    deleteRoom(roomId: string, userId: string) {
        const room = prisma.room.findFirst({
            where: {
                id: roomId,
                ownerId: userId
        }});

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
}
