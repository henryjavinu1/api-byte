import mysql from 'mysql2/promise';
import { envs } from './env.config';

// Crear pool de conexiones
export const db = mysql.createPool({
  host: envs.DB.HOST,
  port: envs.DB.PORT,
  user: envs.DB.USER,
  password: envs.DB.PASSWORD,
  database: envs.DB.NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  ssl: envs.DB.SSL ? { rejectUnauthorized: false } : undefined,
});

async function testConnectionWithRetry(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await db.getConnection();
      console.log('Conexión a MySQL exitosa');
      connection.release();
      return;
    } catch (err) {
      console.log(`MySQL no disponible, reintentando en ${delay/1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('No se pudo conectar a MySQL después de varios intentos');
}

testConnectionWithRetry();

