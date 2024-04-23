import {IsDecimal, IsString, MinLength} from "class-validator";

export class ReportDto {
    @IsString()
    measurementType: string;

    @IsDecimal()
    measurementValue: string;

    @IsString()
    @MinLength(1)
    unit: string;
}
