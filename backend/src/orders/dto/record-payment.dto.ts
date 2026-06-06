import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

export class RecordPaymentDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  @IsOptional()
  transactionReference?: string;
}
