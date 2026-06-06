import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus } from '../common/enums/order-status.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrder(id);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto.status as OrderStatus);
  }

  @Post(':id/payments')
  async recordPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() recordPaymentDto: RecordPaymentDto,
  ) {
    return this.ordersService.recordPayment(id, recordPaymentDto);
  }

  @Post(':id/dispatch/assign')
  async assignDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDriverDto: AssignDriverDto,
  ) {
    return this.ordersService.assignDriver(id, assignDriverDto);
  }

  @Patch(':id/dispatch/status')
  async updateDeliveryStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ) {
    return this.ordersService.updateDeliveryStatus(id, updateDeliveryStatusDto.status);
  }
}
