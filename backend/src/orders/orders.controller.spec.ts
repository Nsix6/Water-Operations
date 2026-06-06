import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';

describe('OrdersController', () => {
  let controller: OrdersController;

  const ordersServiceMock = {
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    getOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    recordPayment: jest.fn(),
    assignDriver: jest.fn(),
    updateDeliveryStatus: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: ordersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('creates an order through the service', async () => {
    ordersServiceMock.createOrder.mockResolvedValue({ id: 1 });

    await expect(
      controller.createOrder({
        customerId: 1,
        items: [{ productName: 'Water', quantity: 2, unitPrice: 15 }],
      }),
    ).resolves.toEqual({ id: 1 });

    expect(ordersServiceMock.createOrder).toHaveBeenCalledWith({
      customerId: 1,
      items: [{ productName: 'Water', quantity: 2, unitPrice: 15 }],
    });
  });

  it('records a payment through the service', async () => {
    ordersServiceMock.recordPayment.mockResolvedValue({ status: OrderStatus.PAID });

    await expect(
      controller.recordPayment(1, {
        amount: 30,
        paymentMethod: 'CARD',
        status: PaymentStatus.PAID,
        transactionReference: 'tx-123',
      }),
    ).resolves.toEqual({ status: OrderStatus.PAID });

    expect(ordersServiceMock.recordPayment).toHaveBeenCalledWith(1, {
      amount: 30,
      paymentMethod: 'CARD',
      status: PaymentStatus.PAID,
      transactionReference: 'tx-123',
    });
  });

  it('assigns a driver through the service', async () => {
    ordersServiceMock.assignDriver.mockResolvedValue({ status: OrderStatus.ASSIGNED });

    await expect(controller.assignDriver(1, { driverId: 44 })).resolves.toEqual({
      status: OrderStatus.ASSIGNED,
    });

    expect(ordersServiceMock.assignDriver).toHaveBeenCalledWith(1, { driverId: 44 });
  });

  it('updates delivery status through the service', async () => {
    ordersServiceMock.updateDeliveryStatus.mockResolvedValue({
      status: OrderStatus.OUT_FOR_DELIVERY,
      deliveryAssignment: { status: DeliveryStatus.OUT_FOR_DELIVERY },
    });

    await expect(controller.updateDeliveryStatus(1, { status: DeliveryStatus.OUT_FOR_DELIVERY })).resolves.toEqual(
      {
        status: OrderStatus.OUT_FOR_DELIVERY,
        deliveryAssignment: { status: DeliveryStatus.OUT_FOR_DELIVERY },
      },
    );

    expect(ordersServiceMock.updateDeliveryStatus).toHaveBeenCalledWith(1, DeliveryStatus.OUT_FOR_DELIVERY);
  });
});
