import {GetMeasurementsInput} from "../../graphql.schema";
import {IsDate, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class GetMeasurementDto extends GetMeasurementsInput {
    @IsNotEmpty()
    @IsString()
    plantId: string;

    @IsOptional()
    @IsDateString()
    before?: string;

    @IsOptional()
    @IsDateString()
    after?: string;
}
