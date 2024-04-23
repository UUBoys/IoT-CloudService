import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {prisma} from "src/util/db/client";
import {Prisma} from "@prisma/client";
import {UpdateTaskDto} from "./dto/update-task.dto";

@Injectable()
export class DevicesService {
    getByToken(token: string) {
        return prisma.plant.findFirstOrThrow({
            where: {
                token,
            },
        });
    }

    async heartbeat(id: string) {
        await prisma.plant.update({
            where: {
                id,
            },
            data: {
                lastHeartbeat: new Date(),
            },
        });
    }

    async getDevice(id: string) {
        let device = await prisma.plant.findFirst({
            where: {
                id,
            },
        });

        if (!device) {
            throw new NotFoundException("Device not found");
        }

        return device
    }

    createTask(task: Prisma.TaskCreateInput) {
        return prisma.task.create({
            data: task,
        });
    }

    updateTask(plantId: string, id: string, task: Prisma.TaskUpdateInput) {
        return prisma.task.update({
            where: {
                id,
                plantId
            },
            data: task,
        });
    }

    async pairDevice(id: string) {
        let crypto = require("crypto");
        let token = crypto.randomBytes(32).toString("hex");

        const device = await prisma.plant.findFirstOrThrow({
            where: {
                id,
            },
        });

        if (device.paired) {
            throw new BadRequestException("Device already paired");
        }

        return prisma.plant.update({
            where: {
                id,
            },
            data: {
                paired: true,
                token,
            },
        });
    }

    getDeviceTasks(id: string) {
        return prisma.task.findMany({
            where: {
                plantId: id,
            },
        });
    }

    createReport(report: Prisma.MeasurementCreateInput) {
        return prisma.measurement.create({
            data: report,
        });
    }
}
