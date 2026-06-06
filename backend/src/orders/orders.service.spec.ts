import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';

describe('OrdersService', () => {
  let service: OrdersService;

  const prismaMock = {
    prisma: {
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('creates an order with items and a computed total', async () => {
    prismaMock.prisma.order.create.mockResolvedValue({
      id: 1,
      customerId: 1,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      totalAmount: 30,
      customer: { id: 1, firstName: 'Aqua', lastName: 'Admin' },
      items: [{ id: 1, productName: 'Water', quantity: 2, unitPrice: 15 }],
      payment: null,
      deliveryAssignment: null,
    });

    await expect(
      service.createOrder({
        customerId: 1,
        items: [{ productName: 'Water', quantity: 2, unitPrice: 15 }],
      }),
    ).resolves.toMatchObject({
      id: 1,
      totalAmount: '30',
      status: OrderStatus.PENDING_PAYMENT,
    });

    expect(prismaMock.prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          customerId: 1,
          status: OrderStatus.PENDING_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
        }),
      }),
    );
  });

  it('records a successful payment and advances the order status', async () => {
    prismaMock.prisma.order.findUnique.mockResolvedValue({ id: 1, status: OrderStatus.PENDING_PAYMENT });
    prismaMock.prisma.order.update.mockResolvedValue({
      id: 1,
      status: OrderStatus.PAID,
      paymentStatus: PaymentStatus.PAID,
      totalAmount: 30,
      customer: { id: 1 },
      items: [],
      payment: { amount: 30, paymentMethod: 'CARD', status: PaymentStatus.PAID },
      deliveryAssignment: null,
    });

    await expect(
      service.recordPayment(1, {
        amount: 30,
        paymentMethod: 'CARD',
        status: PaymentStatus.PAID,
        transactionReference: 'tx-123',
      }),
    ).resolves.toMatchObject({
      status: OrderStatus.PAID,
      paymentStatus: PaymentStatus.PAID,
    });

    expect(prismaMock.prisma.order.update).toHaveBeenCalled();
  });

  it('assigns a driver after the order is ready for dispatch', async () => {
    prismaMock.prisma.order.findUnique.mockResolvedValue({ id: 1, status: OrderStatus.READY_FOR_DISPATCH });
    prismaMock.prisma.order.update.mockResolvedValue({
      id: 1,
      status: OrderStatus.ASSIGNED,
      paymentStatus: PaymentStatus.PAID,
      totalAmount: 30,
      customer: { id: 1 },
      items: [],
      payment: null,
      deliveryAssignment: { driverId: 44, status: DeliveryStatus.ASSIGNED },
    });

    await expect(service.assignDriver(1, { driverId: 44 })).resolves.toMatchObject({
      status: OrderStatus.ASSIGNED,
      deliveryAssignment: { driverId: 44, status: DeliveryStatus.ASSIGNED },
    });
  });

  it('updates delivery status during the dispatch flow', async () => {
    prismaMock.prisma.order.findUnique.mockResolvedValue({ id: 1, status: OrderStatus.ASSIGNED });
    prismaMock.prisma.order.update.mockResolvedValue({
      id: 1,
      status: OrderStatus.OUT_FOR_DELIVERY,
      paymentStatus: PaymentStatus.PAID,
      totalAmount: 30,
      customer: { id: 1 },
      items: [],
      payment: null,
      deliveryAssignment: { driverId: 44, status: DeliveryStatus.OUT_FOR_DELIVERY },
    });

    await expect(service.updateDeliveryStatus(1, DeliveryStatus.OUT_FOR_DELIVERY)).resolves.toMatchObject(
      {
        status: OrderStatus.OUT_FOR_DELIVERY,
        deliveryAssignment: { status: DeliveryStatus.OUT_FOR_DELIVERY },
      },
    );
  });
});
