import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsResolver } from './plants.resolver';
import {MeasurementsService} from "../measurements/measurements.service";
import {RoomsService} from "../rooms/rooms.service";
import {SchedulerRegistry} from "@nestjs/schedule";

@Module({
  providers: [PlantsResolver, PlantsService, MeasurementsService, RoomsService, SchedulerRegistry],
})
export class PlantsModule {}
