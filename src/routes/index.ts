import { Router } from 'express';
import { db } from '@config/db.config';
import personRoutes from './person.routes';
import { keycloak } from '../config/keycloak.config';

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
// router.use('/persons', keycloak.protect(), personRoutes);
router.use('/persons', personRoutes);

// proteger rutas con roles específicos:
// router.use('/admin/persons', keycloak.protect("realm:admin"), personRoutes);

export default router;
