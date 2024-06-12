import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/util/db/client';
import {PairPlantDto} from "./dto/plant.dto";
import {Timeout} from "@nestjs/schedule";

@Injectable()
export class PlantsService {
  async pair(dto: PairPlantDto, userId: string) {
    let plant = await prisma.plant.findFirst({
        where: {
            pairingCode: dto.pairingCode,
        },
      });

    if(!plant) {
        throw new NotFoundException('Invalid pairing code');
    }

    if(plant.userPaired) {
        throw new NotFoundException('Plant already paired by user');
    }

    return prisma.plant.update({
        where: {
            id: plant.id,
        },
        data: {
            ownerId: userId,
            name: dto.name,
            description: dto.description,
            type: dto.type,
            userPaired: true,
        },
    });
  }

  async chechPairingProcess(pairingCode: string) {
    let plant = await prisma.plant.findFirst({
        where: {
            pairingCode: pairingCode,
        },
    });

    if(!plant) {
        throw new NotFoundException('Invalid pairing code');
    }

    return plant;
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

  findByRoomId(roomId: string) {
    return prisma.plant.findMany({
      where: {
        roomId: roomId,
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

    const unpairedPlant = prisma.plant.update({
      where: {
        id: id,
        ownerId: ownerId,
      },
      data: {
        ownerId: null,
        name: null,
        type: null,
        roomId: null,
        paired: false,
        userPaired: false,
      }
    });

    if(!unpairedPlant) {
        throw new ForbiddenException('Not authorized to unpair plant');
    }

    return unpairedPlant;
  }

  async stopPairingProcess(plantId: string) {
    let plant = await prisma.plant.findFirst({
        where: {
            id: plantId,
        },
    });

    if(!plant) {
        console.error('Cant stop pairing process - plant not found');
        return;
    }

    // The device is paired, no need to stop the process
    if(plant.userPaired && plant.paired) {
        return;
    }

    prisma.plant.update({
        where: {
            id: plantId,
        },
        data: {
            userPaired: false,
            paired: false
        }
    });
  }
}
