import {PairPlantInput, UpdatePlantInput} from "../../graphql.schema";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class PairPlantDto extends PairPlantInput {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    token: string;
}

export class UpdatePlantDto extends UpdatePlantInput {
    @IsOptional()
    @IsString()
    plantId: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    type: string;
}
