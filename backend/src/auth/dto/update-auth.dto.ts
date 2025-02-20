import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { ValidRoles } from 'src/common/constant/validRoles';

export class UpdateAuthDto {
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsEnum(ValidRoles)
  role: ValidRoles;

  @IsBoolean()
  @Type(() => Boolean)
  isActive: boolean;
}
