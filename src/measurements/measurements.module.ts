import { Module } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { MeasurementsResolver } from './measurements.resolver';

@Module({
  providers: [MeasurementsResolver, MeasurementsService],
})
export class MeasurementsModule {}
