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

// Ejemplo de uso
async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log(rows); // [{ result: 2 }]
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
  }
}

testConnection();
