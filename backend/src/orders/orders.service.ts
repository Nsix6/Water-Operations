import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const totalAmount = this.calculateTotal(createOrderDto.items);

    const order = await this.prisma.prisma.order.create({
      data: {
        customerId: createOrderDto.customerId,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
        totalAmount: new Prisma.Decimal(totalAmount),
        items: {
          create: createOrderDto.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
          })),
        },
      },
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
    });

    return this.serializeOrder(order);
  }

  async getOrders() {
    const orders = await this.prisma.prisma.order.findMany({
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.serializeOrder(order));
  }

  async getOrder(id: number) {
    const order = await this.prisma.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.serializeOrder(order);
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const current = await this.prisma.prisma.order.findUnique({ where: { id } });

    if (!current) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    this.assertValidTransition(current.status, status);

    const updateData: {
      status: OrderStatus;
      paymentStatus?: PaymentStatus;
    } = {
      status,
    };

    if (status === OrderStatus.PAID) {
      updateData.paymentStatus = PaymentStatus.PAID;
    }

    if (status === OrderStatus.PAYMENT_FAILED) {
      updateData.paymentStatus = PaymentStatus.FAILED;
    }

    if (status === OrderStatus.REFUNDED) {
      updateData.paymentStatus = PaymentStatus.REFUNDED;
    }

    const order = await this.prisma.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
    });

    return this.serializeOrder(order);
  }

  async recordPayment(id: number, recordPaymentDto: RecordPaymentDto) {
    const order = await this.prisma.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    this.assertValidTransition(order.status, this.mapPaymentStatusToOrderStatus(recordPaymentDto.status));

    const nextOrderStatus = this.mapPaymentStatusToOrderStatus(recordPaymentDto.status);

    const updatedOrder = await this.prisma.prisma.order.update({
      where: { id },
      data: {
        status: nextOrderStatus,
        paymentStatus: recordPaymentDto.status,
        payment: {
          upsert: {
            create: {
              amount: new Prisma.Decimal(recordPaymentDto.amount),
              paymentMethod: recordPaymentDto.paymentMethod,
              status: recordPaymentDto.status,
              transactionReference: recordPaymentDto.transactionReference,
            },
            update: {
              amount: new Prisma.Decimal(recordPaymentDto.amount),
              paymentMethod: recordPaymentDto.paymentMethod,
              status: recordPaymentDto.status,
              transactionReference: recordPaymentDto.transactionReference,
            },
          },
        },
      },
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
    });

    return this.serializeOrder(updatedOrder);
  }

  async assignDriver(id: number, assignDriverDto: AssignDriverDto) {
    const order = await this.prisma.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    this.assertValidTransition(order.status, OrderStatus.ASSIGNED);

    const updatedOrder = await this.prisma.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.ASSIGNED,
        deliveryAssignment: {
          upsert: {
            create: {
              driverId: assignDriverDto.driverId,
              status: DeliveryStatus.ASSIGNED,
            },
            update: {
              driverId: assignDriverDto.driverId,
              status: DeliveryStatus.ASSIGNED,
            },
          },
        },
      },
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
    });

    return this.serializeOrder(updatedOrder);
  }

  async updateDeliveryStatus(id: number, status: DeliveryStatus) {
    const order = await this.prisma.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    const mappedOrderStatus = this.mapDeliveryStatusToOrderStatus(status);
    this.assertValidTransition(order.status, mappedOrderStatus);

    const updatedOrder = await this.prisma.prisma.order.update({
      where: { id },
      data: {
        status: mappedOrderStatus,
        deliveryAssignment: {
          upsert: {
            create: {
              status,
            },
            update: {
              status,
            },
          },
        },
      },
      include: {
        customer: true,
        items: true,
        payment: true,
        deliveryAssignment: true,
      },
    });

    return this.serializeOrder(updatedOrder);
  }

  private calculateTotal(items: CreateOrderDto['items']) {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  private serializeOrder(order: any) {
    return {
      ...order,
      totalAmount: order.totalAmount?.toString?.() ?? order.totalAmount,
      payment: order.payment
        ? {
            ...order.payment,
            amount: order.payment.amount?.toString?.() ?? order.payment.amount,
          }
        : order.payment,
      items: order.items?.map((item: any) => ({
        ...item,
        unitPrice: item.unitPrice?.toString?.() ?? item.unitPrice,
      })),
    };
  }

  private mapPaymentStatusToOrderStatus(status: PaymentStatus): OrderStatus {
    switch (status) {
      case PaymentStatus.PAID:
        return OrderStatus.PAID;
      case PaymentStatus.FAILED:
        return OrderStatus.PAYMENT_FAILED;
      case PaymentStatus.REFUNDED:
        return OrderStatus.REFUNDED;
      default:
        return OrderStatus.PENDING_PAYMENT;
    }
  }

  private mapDeliveryStatusToOrderStatus(status: DeliveryStatus): OrderStatus {
    switch (status) {
      case DeliveryStatus.ASSIGNED:
        return OrderStatus.ASSIGNED;
      case DeliveryStatus.OUT_FOR_DELIVERY:
        return OrderStatus.OUT_FOR_DELIVERY;
      case DeliveryStatus.DELIVERED:
        return OrderStatus.DELIVERED;
      case DeliveryStatus.FAILED:
        return OrderStatus.DELIVERY_FAILED;
      default:
        return OrderStatus.ASSIGNED;
    }
  }

  private assertValidTransition(current: OrderStatus, next: OrderStatus) {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING_PAYMENT]: [
        OrderStatus.PAID,
        OrderStatus.PAYMENT_FAILED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PAID]: [OrderStatus.READY_FOR_DISPATCH, OrderStatus.REFUNDED, OrderStatus.CANCELLED],
      [OrderStatus.READY_FOR_DISPATCH]: [OrderStatus.ASSIGNED, OrderStatus.CANCELLED],
      [OrderStatus.ASSIGNED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.DELIVERY_FAILED],
      [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.PAYMENT_FAILED]: [],
      [OrderStatus.DELIVERY_FAILED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!allowedTransitions[current]?.includes(next)) {
      throw new BadRequestException(`Cannot transition order from ${current} to ${next}`);
    }
  }
}
