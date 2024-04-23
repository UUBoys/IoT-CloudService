import {IsDecimal, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ReportDto {
    @IsString()
    @ApiProperty()
    measurementType: string;

    @IsDecimal()
    @ApiProperty()
    measurementValue: string;

    @IsString()
    @MinLength(1)
    @ApiProperty()
    unit: string;
}
