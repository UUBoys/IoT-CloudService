import { Injectable } from '@nestjs/common';
import {prisma} from "../util/db/client";
import {GetMeasurementDto} from "./dto/measurement.dto";

@Injectable()
export class MeasurementsService {

    async getMeasurements(dto: GetMeasurementDto) {
        const startDate = new Date(dto.after);
        const endDate = new Date(dto.before);


        return prisma.measurement.findMany({
            where: {
                plantId: dto.plantId,
                createdAt: startDate && endDate ? {
                    gte: startDate,
                    lte: endDate
                } : undefined
            },
        })
    }
}
