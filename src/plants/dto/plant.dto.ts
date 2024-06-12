import {PairPlantInput, UpdatePlantInput} from "../../graphql.schema";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class PairPlantDto extends PairPlantInput {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    pairingCode: string;

    @IsOptional()
    @IsString()
    imageUrl: string;
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

    @IsOptional()
    @IsString()
    imageUrl: string;
}
