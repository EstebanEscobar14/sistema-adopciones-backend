import express from 'express';
import { 
  crearReserva, 
  obtenerReservas, 
  obtenerReserva, 
  actualizarReserva, 
  eliminarReserva, 
  obtenerReservasPorAdopcionId,
  obtenerReservaPorUsuarioYAdopcion
} from '../controllers/reservaController.js';

const router = express.Router();

// Rutas de reservas
router.post('/reservas', crearReserva);
router.get('/reservas', obtenerReservas);
router.get('/reservas/:id', obtenerReserva);
router.get('/reservas/adopcion/:adopcionId', obtenerReservasPorAdopcionId);  // Obtener reservas por adopcionId
router.get('/reservas/usuario/:usuarioId/adopcion/:adopcionId', obtenerReservaPorUsuarioYAdopcion);  // Obtener reserva por usuario y adopcion
router.put('/reservas/:id', actualizarReserva);
router.delete('/reservas/:id', eliminarReserva);

export default router;
