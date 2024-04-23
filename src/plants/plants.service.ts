import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/util/db/client';
import {PairPlantDto} from "./dto/plant.dto";

@Injectable()
export class PlantsService {
  async pair(dto: PairPlantDto, userId: string) {
    let plant = await prisma.plant.findFirst({
        where: {
            token: dto.token,
        },
      });

    if(!plant) {
        throw new NotFoundException('Invalid token');
    }

    return prisma.plant.update({
        where: {
            id: plant.id,
        },
        data: {
            ownerId: userId,
            name: dto.name,
            type: dto.type,
        },
    });
  }

  findAllForUser(ownerId: string) {
    return prisma.plant.findMany({
      where: {
        ownerId: ownerId,
      },
    });
  }

  findOne(id: string, ownerId: string) {
    let plant = prisma.plant.findFirst({
      where: {
        id: id,
        ownerId: ownerId,
      },
    });

    if (!plant) {
      throw new NotFoundException('Plant not found');
    }
    
    return plant;
  }

  findByRoomId(roomId: string, ownerId: string) {
    return prisma.plant.findMany({
      where: {
        roomId: roomId,
        ownerId: ownerId,
      },
    });
  }

  update(plant: Prisma.PlantUpdateInput, ownerId: string) {
    let updatedPlant = prisma.plant.update({
      where: {
        id: plant.id as string,
        ownerId: ownerId,
      },
      data: plant,
    });

    if (!updatedPlant) {
      throw new NotFoundException('Plant not found');
    }

    return updatedPlant;
  }

  unpair(id: string, ownerId: string) {
    let plant = prisma.plant.findFirst({
      where: {
        id: id,
        ownerId: ownerId,
      },
    });

    if(!plant) {
      throw new NotFoundException('Plant not found');
    }

    return prisma.plant.update({
      where: {
        id: id,
        ownerId: ownerId,
        },
      data: {
        ownerId: null,
      }
    });
  }
}
