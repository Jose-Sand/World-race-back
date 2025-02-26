import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class RolDto {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  name: string;
}
export class UserRequestDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsBoolean()
  @Type(() => Boolean)
  isActive: boolean;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt: Date;

  @ValidateNested({ each: true })
  @Type(() => RolDto)
  role: RolDto;
}
