import {
    AddPlantsToRoomInput,
    AddUserToRoomInput,
    CreateRoomInput,
    RemovePlantsFromRoomInput,
    RoomPlantInput
} from "../../graphql.schema";
import {ArrayMinSize, IsArray, IsEmail, IsOptional, Length, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

class RoomPlantDto extends RoomPlantInput {
    @Length(3)
    plantId: string;
}

export class CreateRoomDto extends CreateRoomInput {
    @Length(3)
    name: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => RoomPlantDto)
    plants: RoomPlantDto[];
}

export class AddPlantsToRoomDto extends AddPlantsToRoomInput {
    @Length(3)
    roomId: string;

    @IsArray()
    @ValidateNested({each: true})
    @ArrayMinSize(1)
    @Type(() => RoomPlantDto)
    plants: RoomPlantDto[];
}

export class RemovePlantsFromRoomDto extends RemovePlantsFromRoomInput{
    @Length(3)
    roomId: string;

    @IsArray()
    @ValidateNested({each: true})
    @ArrayMinSize(1)
    @Type(() => RoomPlantDto)
    plants: RoomPlantDto[];
}

export class AddUserToRoomDto extends AddUserToRoomInput {
    @Length(3)
    roomId: string;

    @IsEmail()
    userEmail: string;
}
