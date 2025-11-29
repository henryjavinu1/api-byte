import { Router } from 'express';
import { db } from '@config/db.config';
import personRoutes from './person.routes';
import { verifyToken } from 'middlewares/verifyToken';
import { requireRole } from 'middlewares/requireRole';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API está corriendo correctamente',
    timestamp: new Date().toISOString(),
  });
});

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS now');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error conectando a MySQL', details: err });
  }
});

// Proteger TODO el módulo de personas
router.use('/persons', verifyToken, personRoutes);

export default router;
