import {IsBoolean, IsOptional} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class UpdateTaskDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  completed?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  success?: boolean;
}
