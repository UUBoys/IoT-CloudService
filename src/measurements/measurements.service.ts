import { Injectable } from '@nestjs/common';
import {prisma} from "../util/db/client";
import {GetMeasurementDto} from "./dto/measurement.dto";

@Injectable()
export class MeasurementsService {

    async getMeasurements(dto: GetMeasurementDto) {
        let startDate = dto.after ? new Date(dto.after) : undefined;
        let endDate = dto.before ? new Date(dto.before) : undefined;

        if(isNaN(startDate.getTime())) {
            startDate = undefined;
        }

        if(isNaN(endDate.getTime())) {
            endDate = undefined;
        }

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
