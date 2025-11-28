import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.json({
		ok: true,
		message: 'SMARTPOS API está corriendo 🚀',
		timestamp: new Date().toISOString(),
	});
});

// Descomentar esta linea cuando ya vayamos a consumir endPoint con Token
// router.use(validarJWT)


export default router;
