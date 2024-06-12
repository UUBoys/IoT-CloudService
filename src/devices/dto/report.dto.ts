import {IsNumber, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ReportDto {
    @IsString()
    @ApiProperty()
    measurementType: string;

    @IsNumber()
    @ApiProperty()
    measurementValue: string;

    @IsString()
    @MinLength(1)
    @ApiProperty()
    unit: string;
}
