import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ValidRoles } from 'src/common/constant/validRoles';

export class CreateAuthDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  // @IsNumber()
  // cityId: number;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(200)
  password: string;

  @IsEnum(ValidRoles)
  role: ValidRoles = ValidRoles.user;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  phone?: string;
}
