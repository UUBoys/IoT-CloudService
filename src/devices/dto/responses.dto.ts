import { ApiProperty } from "@nestjs/swagger";

export class DeviceInfo {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    isPaired: boolean;
}

export class PairDeviceResponse {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    token: string;
    @ApiProperty()
    device_id: string;
}

export class TaskResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    completed: boolean;
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    plantId: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}

export class UpdateTaskResponse {
    task_id: string;
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    completed: boolean;
}

export class CreateReportResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    value: number;
    @ApiProperty()
    unit: string;
    @ApiProperty()
    measurementType: string;
    @ApiProperty()
    plantId: string;
    @ApiProperty()
    createdAt: Date;
}
