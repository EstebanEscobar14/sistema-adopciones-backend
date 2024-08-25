// src/routes/adopcionRoutes.js
import { Router } from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';
import { actualizarAdopcion, crearAdopcion, eliminarAdopcion, obtenerAdopcion, obtenerAdopciones } from '../controllers/adopcionController.js';


const router = Router();

router.get('/', obtenerAdopciones); // Obtener todas las adopciones
router.get('/:id', obtenerAdopcion); // Obtener una adopción específica

router.post('/', authenticateToken, authorizeAdmin, crearAdopcion); // Crear una adopción (solo para administradores)
router.put('/:id', authenticateToken, authorizeAdmin, actualizarAdopcion); // Actualizar una adopción (solo para administradores)
router.delete('/:id', authenticateToken, authorizeAdmin, eliminarAdopcion); // Eliminar una adopción (solo para administradores)

export default router;
