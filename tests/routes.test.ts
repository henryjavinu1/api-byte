import express from 'express';
import request from 'supertest';

// Mocks: evitar llamadas reales a MySQL al importar rutas
jest.mock('@config/db.config', () => ({
  db: {
    query: jest.fn().mockResolvedValue([[{ now: '2025-11-28T00:00:00Z' }]])
  }
}));

// Evitar que Jest intente cargar el paquete ESM 'jose' en el entorno de tests
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  createRemoteJWKSet: jest.fn()
}));

import routes from '../src/routes/index';

describe('Rutas públicas', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', routes);

  test('GET /api/ devuelve estado OK', async () => {
    const res = await request(app).get('/api/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /api/test-db usa db.query y responde', async () => {
    const res = await request(app).get('/api/test-db');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0]).toHaveProperty('now');
  });
});
