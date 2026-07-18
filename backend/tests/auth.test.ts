import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API - /api/auth/*', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user successfully and return 201 with the user object (excluding password fields)', async () => {
    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(registrationData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(registrationData.name);
    expect(res.body.email).toBe(registrationData.email);
    expect(res.body.role).toBe('USER');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('should return 409 when registering with a duplicate email', async () => {
    const registrationData = {
      name: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123',
    };

    await request(app).post('/api/auth/register').send(registrationData);
    const res = await request(app).post('/api/auth/register').send(registrationData);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 200 and a JWT token when logging in with valid credentials', async () => {
    const credentials = {
      name: 'Login User',
      email: 'login@example.com',
      password: 'secretpassword',
    };

    await request(app).post('/api/auth/register').send(credentials);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(credentials.email);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('should return 401 when logging in with an incorrect password', async () => {
    const credentials = {
      name: 'Wrong Pass User',
      email: 'wrongpass@example.com',
      password: 'correctpassword',
    };

    await request(app).post('/api/auth/register').send(credentials);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
