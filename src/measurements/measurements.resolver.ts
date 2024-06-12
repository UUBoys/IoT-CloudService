import {Args, Query, Resolver} from '@nestjs/graphql';
import { MeasurementsService } from './measurements.service';
import {Measurement} from "../graphql.schema";
import {GetMeasurementDto} from "./dto/measurement.dto";

@Resolver('Measurement')
export class MeasurementsResolver {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Query('getMeasurements')
  async getMeasurements(@Args('getMeasurementsInput') getMeasurementArgs: GetMeasurementDto): Promise<Measurement[]> {
    const measurements = await this.measurementsService.getMeasurements(getMeasurementArgs);

    return measurements.map(measurement => {
        return {
            id: measurement.id,
            value: measurement.value,
            date: measurement.createdAt.toISOString(),
        }
    })
  }
}
