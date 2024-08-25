import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

// Ruta para el registro de usuarios
router.post('/register', register);
// Ruta para el inicio de sesión
router.post('/login', login);

export default router;
