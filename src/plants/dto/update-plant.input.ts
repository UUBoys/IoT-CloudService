import { CreatePlantInput } from './create-plant.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePlantInput extends PartialType(CreatePlantInput) {
  id: number;
}
