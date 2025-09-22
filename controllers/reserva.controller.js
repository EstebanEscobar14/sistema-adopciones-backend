import Reserva from "../models/reserva.model.js";
import Adopcion from "../models/adopcion.model.js";

// Crear una nueva reserva
export async function crearReserva(req, res) {
  try {
    const { idUsuario, adopcionId, nombres, apellidos, edad, ciudad, fechaVisita } = req.body;

    // Validar campos requeridos
    if (!idUsuario || !adopcionId || !nombres || !apellidos || !edad || !ciudad || !fechaVisita) {
      return res.status(400).json({ msg: "Faltan campos requeridos" });
    }

    // Validar edad mínima (18 años)
    if (edad < 18) {
      return res.status(400).json({ msg: "Debes ser mayor de 18 años para reservar" });
    }

    // Verificar si el usuario ya tiene una reserva para esta adopción
    const reservaExistente = await Reserva.findOne({ idUsuario, adopcionId });
    if (reservaExistente) {
      return res.status(400).json({ msg: "Ya tienes una reserva para esta adopción" });
    }

    // Verificar si la adopción existe y es adoptable
    const adopcion = await Adopcion.findById(adopcionId);
    if (!adopcion) {
      return res.status(404).json({ msg: "Adopción no encontrada" });
    }
    if (!adopcion.adoptable || adopcion.estado === 'Adoptada') {
      return res.status(400).json({ msg: "Esta adopción no está disponible" });
    }

    const reserva = new Reserva({
      idUsuario,
      adopcionId,
      nombres,
      apellidos,
      edad,
      ciudad,
      fechaVisita: new Date(fechaVisita),
      estado: 'Solicitado' // Valor por defecto
    });

    await reserva.save();
    res.status(201).json(reserva);
  } catch (error) {
    console.error("Error al crear reserva:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).json({ msg: "Error al crear reserva" });
  }
}

// Obtener todas las reservas
export async function obtenerReservas(req, res) {
  try {
    const reservas = await Reserva.find()
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ msg: "Error al obtener reservas" });
  }
}

// Obtener una reserva por ID
export async function obtenerReserva(req, res) {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
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
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ msg: "Reserva no encontrada" });

    if (reserva.idUsuario.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado para modificar esta reserva" });
    }

    Object.assign(reserva, req.body);
    await reserva.save();
    res.json(reserva);
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).json({ msg: "Error al actualizar reserva" });
  }
}

// Eliminar una reserva
export async function eliminarReserva(req, res) {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    if (reserva.idUsuario.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado para eliminar esta reserva" });
    }

    await Reserva.deleteOne({ _id: req.params.id });
    res.json({ msg: "Reserva eliminada" });
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    res.status(500).json({ msg: "Error al eliminar reserva" });
  }
}

// Obtener reservas por adopción ID
export async function obtenerReservasPorAdopcionId(req, res) {
  try {
    const reservas = await Reserva.find({ adopcionId: req.params.adopcionId })
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas por ID de adopcion:", error);
    res.status(500).json({ msg: "Error al obtener reservas por ID de adopcion" });
  }
}

// Obtener reserva por usuario y adopción
export async function obtenerReservaPorUsuarioYAdopcion(req, res) {
  try {
    const { usuarioId, adopcionId } = req.params;
    const reserva = await Reserva.findOne({ idUsuario: usuarioId, adopcionId })
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }
    res.json(reserva);
  } catch (error) {
    console.error("Error al obtener reserva por usuario y adopcion:", error);
    res.status(500).json({ msg: "Error al obtener reserva por usuario y adopcion" });
  }
}

// Obtener reservas por usuario autenticado
export async function obtenerReservasPorUsuario(req, res) {
  try {
    const reservas = await Reserva.find({ idUsuario: req.user.id })
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas por usuario:", error);
    res.status(500).json({ msg: "Error al obtener reservas por usuario" });
  }
}

// Obtener reservas de las adopciones del usuario autenticado
export async function obtenerReservasDeMisAdopciones(req, res) {
  try {
    const adopciones = await Adopcion.find({ usuario: req.user.id }, '_id');
    const adopcionIds = adopciones.map(adopcion => adopcion._id);
    const reservas = await Reserva.find({ adopcionId: { $in: adopcionIds } })
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas de mis adopciones:", error);
    res.status(500).json({ msg: "Error al obtener reservas de mis adopciones" });
  }
}

// Actualizar estado de una reserva
export async function actualizarEstadoReserva(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['Solicitado', 'Visita Realizada', 'Exitosa', 'No Exitosa'].includes(estado)) {
      return res.status(400).json({ msg: "Estado inválido" });
    }

    const reserva = await Reserva.findById(id).populate('adopcionId');
    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    const adopcion = await Adopcion.findById(reserva.adopcionId);
    if (!adopcion) {
      return res.status(404).json({ msg: "Adopción no encontrada" });
    }

    if (adopcion.usuario.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado para modificar esta reserva" });
    }

    // Verificar si ya existe una reserva exitosa para esta adopción
    if (estado === 'Exitosa') {
      const reservaExitosa = await Reserva.findOne({
        adopcionId: reserva.adopcionId,
        estado: 'Exitosa',
        _id: { $ne: id } // Excluir la reserva actual
      });
      if (reservaExitosa) {
        return res.status(400).json({ msg: "Ya existe una reserva exitosa para esta adopción" });
      }

      // Cambiar el estado de la adopción a no adoptable y actualizar estado
      adopcion.adoptable = false;
      adopcion.estado = 'Adoptada';
      await adopcion.save();

      // Actualizar otras reservas a "No Exitosa"
      await Reserva.updateMany(
        { adopcionId: reserva.adopcionId, _id: { $ne: id }, estado: { $in: ['Solicitado', 'Visita Realizada'] } },
        { estado: 'No Exitosa' }
      );
    }

    reserva.estado = estado;
    await reserva.save();

    // Devolver la reserva con datos poblados
    const reservaActualizada = await Reserva.findById(id)
      .populate("adopcionId", "nombre raza categoria")
      .populate("idUsuario", "username");
    res.json(reservaActualizada);
  } catch (error) {
    console.error("Error al actualizar estado de reserva:", error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    res.status(500).json({ msg: "Error al actualizar estado de reserva" });
  }
}