import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
  @IsString()
  currency: string;

  @Type(() => Number)
  @IsNumber()
  unit_amount: number;

  @IsString()
  @IsOptional()
  country?: string;
}
