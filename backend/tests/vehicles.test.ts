import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Vehicle API - /api/vehicles/*', () => {
  let userToken: string;
  let adminToken: string;

  beforeEach(async () => {
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({});

    // Create standard user
    await request(app).post('/api/auth/register').send({
      name: 'Standard User',
      email: 'user@example.com',
      password: 'password123',
    });
    const userRes = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'password123',
    });
    userToken = userRes.body.token;

    // Create admin user manually via Prisma to set role = ADMIN
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'dummyhash',
        role: 'ADMIN',
      },
    });
    // Login or sign token for admin
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      process.env.JWT_SECRET || 'redgreenmotors-super-secret-key-2026',
      { expiresIn: '24h' }
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow admin to create a vehicle (POST /api/vehicles)', async () => {
    const vehicleData = {
      make: 'Porsche',
      model: '911 GT3',
      category: 'Coupe',
      price: 185000,
      quantity: 2,
    };

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehicleData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.make).toBe(vehicleData.make);
    expect(res.body.quantity).toBe(vehicleData.quantity);
  });

  it('should reject non-admin from creating a vehicle with 403', async () => {
    const vehicleData = {
      make: 'Porsche',
      model: '911 GT3',
      category: 'Coupe',
      price: 185000,
      quantity: 2,
    };

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send(vehicleData);

    expect(res.status).toBe(403);
  });

  it('should list all vehicles including quantity 0 (GET /api/vehicles)', async () => {
    await prisma.vehicle.createMany({
      data: [
        { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 26000, quantity: 5 },
        { make: 'Honda', model: 'Civic', category: 'Sedan', price: 24000, quantity: 0 },
      ],
    });

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should search vehicles by make, model, category, and price range (GET /api/vehicles/search)', async () => {
    await prisma.vehicle.createMany({
      data: [
        { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 26000, quantity: 5 },
        { make: 'Ford', model: 'F-150', category: 'Truck', price: 45000, quantity: 3 },
        { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 32000, quantity: 4 },
      ],
    });

    const res = await request(app)
      .get('/api/vehicles/search?make=toyota&maxPrice=30000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('Camry');
  });

  it('should allow user to purchase a vehicle, decrementing quantity by 1 (POST /api/vehicles/:id/purchase)', async () => {
    const vehicle = await prisma.vehicle.create({
      data: { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 26000, quantity: 3 },
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(2);

    const updated = await prisma.vehicle.findUnique({ where: { id: vehicle.id } });
    expect(updated?.quantity).toBe(2);
  });

  it('should reject purchase with 409 when vehicle quantity is 0', async () => {
    const vehicle = await prisma.vehicle.create({
      data: { make: 'Honda', model: 'Civic', category: 'Sedan', price: 24000, quantity: 0 },
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should allow admin to restock a vehicle (POST /api/vehicles/:id/restock)', async () => {
    const vehicle = await prisma.vehicle.create({
      data: { make: 'Honda', model: 'Civic', category: 'Sedan', price: 24000, quantity: 0 },
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(5);
  });

  it('should reject restock attempt from non-admin with 403', async () => {
    const vehicle = await prisma.vehicle.create({
      data: { make: 'Honda', model: 'Civic', category: 'Sedan', price: 24000, quantity: 0 },
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(403);
  });
});
