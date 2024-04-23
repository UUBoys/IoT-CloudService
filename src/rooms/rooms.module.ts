import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';
import {PlantsService} from "../plants/plants.service";

@Module({
  providers: [RoomsResolver, RoomsService, PlantsService],
})
export class RoomsModule {}
