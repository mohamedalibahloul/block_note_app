const request = require('supertest');
const path = require('path');
const fs = require('fs');

process.env.DB_PATH = path.join(__dirname, '../../data/test_auth.db');

const app = require('../../backend/src/app');
const { closeDb } = require('../../backend/src/db/database');

afterAll(() => {
  closeDb();
  if (fs.existsSync(process.env.DB_PATH)) fs.unlinkSync(process.env.DB_PATH);
});

describe('POST /api/auth/register', () => {
  it('registers a new user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'secret123',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'user2',
      email: 'dupe@example.com',
      password: 'secret123',
    });
    const res = await request(app).post('/api/auth/register').send({
      username: 'user3',
      email: 'dupe@example.com',
      password: 'secret123',
    });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'shortpw',
      email: 'short@example.com',
      password: '123',
    });
    expect(res.status).toBe(400);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'loginuser',
      email: 'login@example.com',
      password: 'mypassword',
    });
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'mypassword',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  it('rejects non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'anypassword',
    });
    expect(res.status).toBe(401);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'login@example.com' });
    expect(res.status).toBe(400);
  });
});
