import express from 'express';
import { authenticateToken } from "../middleware/auth.middleware.js";
import { 
  crearReserva, 
  obtenerReservas, 
  obtenerReserva, 
  actualizarReserva, 
  eliminarReserva, 
  obtenerReservasPorAdopcionId,
  obtenerReservaPorUsuarioYAdopcion
} from '../controllers/reserva.controller.js';

const router = express.Router();

// Rutas de reservas
router.get('/reservas', obtenerReservas);
router.get('/reservas/:id', obtenerReserva);
router.get('/reservas/adopcion/:adopcionId', obtenerReservasPorAdopcionId);  // Obtener reservas por adopcionId
router.get('/reservas/usuario/:usuarioId/adopcion/:adopcionId', obtenerReservaPorUsuarioYAdopcion);  // Obtener reserva por usuario y adopcion
router.post('/reservas', authenticateToken, crearReserva);
router.put('/reservas/:id', authenticateToken, actualizarReserva);
router.delete('/reservas/:id', authenticateToken, eliminarReserva);

export default router;
