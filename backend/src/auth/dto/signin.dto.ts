import { IsEmail, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(200)
  password: string;
}
