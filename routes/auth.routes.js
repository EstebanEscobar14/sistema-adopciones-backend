import { Router } from 'express';
import { register, login, refreshToken } from '../controllers/auth.controller.js';

const router = Router();

// Ruta para el registro de usuarios
router.post('/register', register);
// Ruta para el inicio de sesión
router.post('/login', login);
router.post('/refresh-token', refreshToken);

export default router;
