import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;
}
