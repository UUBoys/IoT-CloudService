import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsResolver } from './plants.resolver';

@Module({
  providers: [PlantsResolver, PlantsService],
})
export class PlantsModule {}
