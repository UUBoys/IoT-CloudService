import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceGuard, NoToken } from './device-guard/device-guard.guard';
import {UpdateTaskDto} from "./dto/update-task.dto";
import {ReportDto} from "./dto/report.dto";
import {Prisma} from "@prisma/client";
import { ApiResponse } from '@nestjs/swagger';
import { CreateReportResponse, DeviceInfo, PairDeviceResponse, TaskResponse, UpdateTaskResponse } from "./dto/responses.dto";

@Controller('devices')
@UseGuards(DeviceGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: () => DeviceInfo, description: 'Device information' })
  async getDeviceInfo(@Param('id') id: string) {
    let device = await this.devicesService.getDevice(id);

    return {
      id: device.id,
      name: device.name,
      isPaired: device.paired,
    };
  }

  @Post(':id/pair')
  @ApiResponse({ status: 200, type: () => PairDeviceResponse, description: 'Device pair response' })
  async pairDevice(@Param('id') id: string) {
    let pairing = await this.devicesService.pairDevice(id);

    return {
      success: true,
      token: pairing.token,
      device_id: pairing.id,
    }
  }

  @Get(':id/tasks')
  @ApiResponse({ status: 200, type: () => TaskResponse, description: 'List of tasks' })
  async getDeviceTasks(@Param('id') id: string) {
    return this.devicesService.getDeviceTasks(id);
  }

  @Patch(':id/tasks/:taskId')
  @ApiResponse({ status: 200, type: () => UpdateTaskResponse, description: 'List of tasks' })
  async updateTask(@Param('id') id: string, @Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto) {
    let task = await this.devicesService.updateTask(id, taskId, updateTaskDto);

    return {
      task_id: task.id,
      success: task.success,
      completed: task.completed,
    };
  }

  @Post(':id/report')
  @ApiResponse({ status: 200, type: () => CreateReportResponse, description: 'List of tasks' })
  async reportDevice(@Param('id') id: string, @Body() reportDto: ReportDto) {
    let report: Prisma.MeasurementCreateInput = {
      measurementType: reportDto.measurementType,
      value: parseFloat(reportDto.measurementValue),
      unit: reportDto.unit,
      plant: {
        connect: {
            id
        }
      }
    }

    return this.devicesService.createReport(report);
  }
}
