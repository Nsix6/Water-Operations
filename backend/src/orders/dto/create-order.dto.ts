import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customerId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
