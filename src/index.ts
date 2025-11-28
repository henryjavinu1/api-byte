import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import routes from './routes/index';
import { db } from './config/db.config';
import { sessionMiddleware, keycloak } from './config/keycloak.config';

export class Server {
  private app: Application;
  private port: string;
  private server: http.Server;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';
    this.server = http.createServer(this.app);

    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));

    // Keycloak session and middleware
    this.app.use(sessionMiddleware);
    this.app.use(keycloak.middleware());
  }

  private routes(): void {
    this.app.use('/api', routes);
  }

  public start(): void {
    this.server.listen(this.port, async () => {
      try {
        const connection = await db.getConnection();
        console.log('Conexión a MySQL exitosa');
        connection.release();
      } catch (err) {
        console.error('Error de conexión a MySQL:', err);
      }

      console.log(`API corriendo en http://localhost:${this.port}`);
    });
  }
}
