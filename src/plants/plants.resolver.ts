import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlantsService } from './plants.service';
import { CreatePlantInput } from './dto/create-plant.input';
import { UpdatePlantInput } from './dto/update-plant.input';

@Resolver('Plant')
export class PlantsResolver {
  constructor(private readonly plantsService: PlantsService) {}

  @Mutation('createPlant')
  create(@Args('createPlantInput') createPlantInput: CreatePlantInput) {
    return this.plantsService.create(createPlantInput);
  }

  @Query('plants')
  findAll() {
    return this.plantsService.findAll();
  }

  @Query('plant')
  findOne(@Args('id') id: number) {
    return this.plantsService.findOne(id);
  }

  @Mutation('updatePlant')
  update(@Args('updatePlantInput') updatePlantInput: UpdatePlantInput) {
    return this.plantsService.update(updatePlantInput.id, updatePlantInput);
  }

  @Mutation('removePlant')
  remove(@Args('id') id: number) {
    return this.plantsService.remove(id);
  }
}
