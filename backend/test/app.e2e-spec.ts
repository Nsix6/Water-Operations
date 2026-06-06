import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

process.env.JWT_SECRET ??= 'test-secret';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const getAdminToken = async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@aquaops.local',
        password: 'Password123!',
      })
      .expect(201);

    return response.body.access_token as string;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });

  it('/users (POST)', () => {
    const email = `admin-${Date.now()}@aquaops.local`;

    return request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Aqua',
        lastName: 'Admin',
        email,
        password: 'Password123!',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toBe('User created successfully');
        expect(body.user.email).toBe(email);
      });
  });

  it('/auth/register and /auth/login (POST)', async () => {
    const email = `auth-${Date.now()}@aquaops.local`;
    const password = 'Password123!';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Auth',
        lastName: 'User',
        email,
        password,
      })
      .expect(201);

    expect(registerResponse.body.access_token).toBeDefined();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    expect(loginResponse.body.access_token).toBeDefined();
  });

  it('/orders flow (POST/PATCH)', async () => {
    const token = await getAdminToken();
    const headers = { Authorization: `Bearer ${token}` };

    const createResponse = await request(app.getHttpServer())
      .post('/orders')
      .set(headers)
      .send({
        customerId: 1,
        items: [{ productName: 'Water', quantity: 2, unitPrice: 15 }],
      })
      .expect(201);

    expect(createResponse.body.status).toBe('PENDING_PAYMENT');

    const paidResponse = await request(app.getHttpServer())
      .post(`/orders/${createResponse.body.id}/payments`)
      .set(headers)
      .send({
        amount: 30,
        paymentMethod: 'CARD',
        status: 'PAID',
        transactionReference: 'tx-e2e-1',
      })
      .expect(201);

    expect(paidResponse.body.status).toBe('PAID');

    const readyResponse = await request(app.getHttpServer())
      .patch(`/orders/${createResponse.body.id}/status`)
      .set(headers)
      .send({ status: 'READY_FOR_DISPATCH' })
      .expect(200);

    expect(readyResponse.body.status).toBe('READY_FOR_DISPATCH');

    const assignedResponse = await request(app.getHttpServer())
      .post(`/orders/${createResponse.body.id}/dispatch/assign`)
      .set(headers)
      .send({ driverId: 1 })
      .expect(201);

    expect(assignedResponse.body.status).toBe('ASSIGNED');

    const outForDeliveryResponse = await request(app.getHttpServer())
      .patch(`/orders/${createResponse.body.id}/dispatch/status`)
      .set(headers)
      .send({ status: 'OUT_FOR_DELIVERY' })
      .expect(200);

    expect(outForDeliveryResponse.body.status).toBe('OUT_FOR_DELIVERY');
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
