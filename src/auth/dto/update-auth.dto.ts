import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { ValidRoles } from 'src/common/constant/validRoles';

export class UpdateAuthDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;
}
