import { Resolver } from '@nestjs/graphql';
import { MeasurementsService } from './measurements.service';

@Resolver('Measurement')
export class MeasurementsResolver {
  constructor(private readonly measurementsService: MeasurementsService) {}
}
