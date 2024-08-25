import Reserva from '../models/Reserva.js';

// Crear una nueva reserva
export async function crearReserva(req, res) {
    try {
        const reserva = new Reserva(req.body);
        await reserva.save();
        res.status(201).json(reserva);
    } catch (error) {
        console.error("Error al crear reserva:", error);
        res.status(500).json({ msg: "Error al crear reserva" });
    }
}

// Obtener todas las reservas
export async function obtenerReservas(req, res) {
    try {
        const reservas = await Reserva.find().populate('adopcionId');
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ msg: "Error al obtener reservas" });
    }
}

// Obtener una reserva por ID
export async function obtenerReserva(req, res) {
    try {
        const reserva = await Reserva.findById(req.params.id).populate('adopcionId');
        if (!reserva) {
            return res.status(404).json({ msg: "Reserva no encontrada" });
        }
        res.json(reserva);
    } catch (error) {
        console.error("Error al obtener reserva:", error);
        res.status(500).json({ msg: "Error al obtener reserva" });
    }
}

// Actualizar una reserva
export async function actualizarReserva(req, res) {
    try {
        const reserva = await Reserva.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!reserva) {
            return res.status(404).json({ msg: "Reserva no encontrada" });
        }
        res.json(reserva);
    } catch (error) {
        console.error("Error al actualizar reserva:", error);
        res.status(500).json({ msg: "Error al actualizar reserva" });
    }
}

// Eliminar una reserva
export async function eliminarReserva(req, res) {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);
        if (!reserva) {
            return res.status(404).json({ msg: "Reserva no encontrada" });
        }
        res.json({ msg: "Reserva eliminada" });
    } catch (error) {
        console.error("Error al eliminar reserva:", error);
        res.status(500).json({ msg: "Error al eliminar reserva" });
    }
}

export async function obtenerReservasPorAdopcionId(req, res) {
    try {
        const reservas = await Reserva.find({ adopcionId: req.params.adopcionId });
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas por ID de adopcion:", error);
        res.status(500).json({ msg: "Error al obtener reservas por ID de adopcion" });
    }
}


export async function obtenerReservaPorUsuarioYAdopcion(req, res) {
    try {
      const { usuarioId, adopcionId } = req.params;
      const reserva = await Reserva.findOne({ idUsuario: usuarioId, adopcionId });
      if (!reserva) {
        return res.status(404).json({ msg: "Reserva no encontrada" });
      }
      res.json(reserva);
    } catch (error) {
      console.error("Error al obtener reserva por usuario y adopcion:", error);
      res.status(500).json({ msg: "Error al obtener reserva por usuario y adopcion" });
    }
  }
  