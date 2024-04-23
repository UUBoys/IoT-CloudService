import {IsBoolean, IsOptional} from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsBoolean()
  success?: boolean;
}
