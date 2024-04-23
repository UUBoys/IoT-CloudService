import { Injectable } from '@nestjs/common';
import {prisma} from "../util/db/client";

@Injectable()
export class MeasurementsService {

    getMeasurements(plantId: string) {
        return prisma.measurement.findMany({
            where: {
                plantId
            }
        })
    }
}
