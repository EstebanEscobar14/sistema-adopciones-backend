import express from 'express';
import { authenticateToken } from "../middleware/auth.middleware.js";
import { 
  crearReserva, 
  obtenerReservas, 
  obtenerReserva, 
  actualizarReserva, 
  eliminarReserva, 
  obtenerReservasPorAdopcionId,
  obtenerReservaPorUsuarioYAdopcion,
  obtenerReservasPorUsuario,
  obtenerReservasDeMisAdopciones,
  actualizarEstadoReserva
} from '../controllers/reserva.controller.js';

const router = express.Router();

// Rutas de reservas
router.get('/reservas/usuario', authenticateToken, obtenerReservasPorUsuario); // Movido antes
router.get('/reservas/mis-adopciones', authenticateToken, obtenerReservasDeMisAdopciones); // Movido antes
router.get('/reservas', authenticateToken, obtenerReservas);
router.get('/reservas/:id', authenticateToken, obtenerReserva);
router.get('/reservas/adopcion/:adopcionId', authenticateToken, obtenerReservasPorAdopcionId);
router.get('/reservas/usuario/:usuarioId/adopcion/:adopcionId', authenticateToken, obtenerReservaPorUsuarioYAdopcion);
router.post('/reservas', authenticateToken, crearReserva);
router.put('/reservas/:id', authenticateToken, actualizarReserva);
router.put('/reservas/:id/estado', authenticateToken, actualizarEstadoReserva);
router.delete('/reservas/:id', authenticateToken, eliminarReserva);

export default router;