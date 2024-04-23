import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlantInput } from './dto/create-plant.input';
import { UpdatePlantInput } from './dto/update-plant.input';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/util/db/client';

@Injectable()
export class PlantsService {
  create(createPlantInput: Prisma.PlantCreateInput) {
    // TODO: Handle pair process of plant
    return prisma.plant.create({
      data: createPlantInput,
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

  remove(id: string, ownerId: string) {
    // TODO: Handle de-pair process of a plant
    // The plant should be able 

    let plant = prisma.plant.findFirst({
      where: {
        id: id,
        ownerId: ownerId,
      },
    });

    if(!plant) {
      throw new NotFoundException('Plant not found');
    }

    return prisma.plant.delete({
      where: {
        id: id,
        ownerId: ownerId,
        },
    });
  }
}
