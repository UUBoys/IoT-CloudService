import {Injectable, NotFoundException} from "@nestjs/common";
import {prisma} from "src/util/db/client";
import {Prisma} from "@prisma/client";
import {Cron, CronExpression} from "@nestjs/schedule";

@Injectable()
export class DevicesService {
    @Cron(CronExpression.EVERY_30_MINUTES)
    async markOffline() {
        const plants = await prisma.plant.updateMany({
            where: {
                // lastHeartbeat older than 3O minutes
                lastHeartbeat: {
                    lt: new Date(Date.now() - 30 * 60 * 1000),
                },
                paired: true,
            },
            data: {
                paired: false,
            },
        });

        console.log(plants.count + " devices marked as offline");
    }

    async getByToken(token: string) {
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

    async createTask(task: Prisma.TaskCreateInput) {
        return prisma.task.create({
            data: task,
        });
    }

    async updateTask(plantId: string, id: string, task: Prisma.TaskUpdateInput) {
        return prisma.task.update({
            where: {
                id,
                plantId
            },
            data: task,
        });
    }

    async pairDevice(id: string) {
        const device = await prisma.plant.findFirst({
            where: {
                id,
            },
        });

        if(!device) {
            throw new NotFoundException("Device not found");
        }

        let crypto = require("crypto");
        let token = crypto.randomBytes(32).toString("hex");

        return prisma.plant.update({
            where: {
                id,
            },
            data: {
                lastHeartbeat: new Date(),
                paired: true,
                token,
            },
        });
    }

    async getDeviceTasks(id: string) {
        const plant = prisma.plant.findFirst({
            where: {
                id,
            },
        });

        if (!plant) {
            throw new NotFoundException("Device not found");
        }

        return prisma.task.findMany({
            where: {
                plantId: id,
            },
        });
    }

    async createReport(report: Prisma.MeasurementCreateInput) {
        return prisma.measurement.create({
            data: report,
        });
    }
}
