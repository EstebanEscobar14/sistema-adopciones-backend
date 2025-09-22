import Adopcion from "../models/adopcion.model.js";

// Crear adopción
export async function crearAdopcion(req, res) {
  try {
    let result;

    if (Array.isArray(req.body)) {
      const adopcionesConUsuario = req.body.map((item) => ({
        ...item,
        usuario: req.user.id,
      }));
      result = await Adopcion.insertMany(adopcionesConUsuario);
    } else {
      const {
        nombre,
        raza,
        categoria,
        peso,
        descripcion,
        fechaNacimiento,
        vacunado,
        adoptable,
        imagen,
        esterilizado,
        actividad,
        socializacion,
        lat,
        lng,
        ubicacion // Nuevo
      } = req.body;

      if (!nombre || !raza || !categoria || !peso || !descripcion) {
        return res.status(400).json({ msg: "Faltan campos requeridos" });
      }

      const nuevaAdopcion = new Adopcion({
        usuario: req.user.id,
        nombre,
        raza,
        categoria,
        peso: Number(peso),
        descripcion,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        vacunado: vacunado ?? false,
        adoptable: adoptable ?? true,
        esterilizado: esterilizado ?? false,
        actividad: actividad ?? undefined,
        socializacion: socializacion ?? undefined,
        imagen,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        ubicacion // Nuevo
      });

      result = await nuevaAdopcion.save();
    }

    res.status(201).json({
      status: 201,
      message: "Adopción(es) creada(s) exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al crear adopción:", error);
    res.status(500).json({ msg: "Error al crear adopción" });
  }
}

// Obtener todas las adopciones (de todos)
export async function obtenerAdopciones(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 12; // Límite por página, por defecto 12
    const skip = (page - 1) * limit; // Calcular documentos a saltar

    // Obtener adopciones con paginación
    const adopciones = await Adopcion.find()
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username")
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);

    // Contar el total de adopciones
    const total = await Adopcion.countDocuments();

    // Mapear resultados con likesCount
    const resultado = adopciones.map((adopcion) => ({
      data: adopcion,
      likesCount: adopcion.likes.length,
    }));

    // Enviar respuesta con datos y metadatos
    res.json({
      data: resultado,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    res.status(500).json({ msg: "Error al obtener adopciones" });
  }
}

// Obtener adopciones solo del usuario autenticado (opcional)
export async function obtenerAdopcionesUsuario(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 10; // Límite por página, por defecto 10
    const skip = (page - 1) * limit; // Calcular documentos a saltar

    // Obtener adopciones del usuario con paginación
    const adopciones = await Adopcion.find({ usuario: req.user.id })
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username")
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);

    // Contar el total de adopciones del usuario
    const total = await Adopcion.countDocuments({ usuario: req.user.id });

    // Mapear resultados con likesCount
    const resultado = adopciones.map((adopcion) => ({
      data: adopcion,
      likesCount: adopcion.likes.length,
    }));

    // Enviar respuesta con datos y metadatos
    res.json({
      data: resultado,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener adopciones de usuario:", error);
    res.status(500).json({ msg: "Error al obtener adopciones de usuario" });
  }
}

// Obtener una adopción por id
export async function obtenerAdopcion(req, res) {
  try {
    const adopcion = await Adopcion.findById(req.params.id)
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username");

    if (!adopcion)
      return res.status(404).json({ msg: "Adopción no encontrada" });

    res.json({
      data: adopcion,
      likesCount: adopcion.likes.length,
    });
  } catch (error) {
    console.error("Error al obtener adopción:", error);
    res.status(500).json({ msg: "Error al obtener adopción" });
  }
}

// Actualizar adopción - solo dueño
export async function actualizarAdopcion(req, res) {
  try {
    const adopcion = await Adopcion.findById(req.params.id)
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username");

    if (!adopcion) {
      return res.status(404).json({ msg: "Adopción no encontrada" });
    }

    if (adopcion.usuario._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    const {
      nombre,
      raza,
      categoria,
      imagen,
      peso,
      descripcion,
      fechaNacimiento,
      vacunado,
      adoptable,
      esterilizado,
      actividad,
      socializacion,
      lat,
      lng,
      ubicacion // Nuevo
    } = req.body;

    adopcion.nombre = nombre || adopcion.nombre;
    adopcion.raza = raza || adopcion.raza;
    adopcion.categoria = categoria || adopcion.categoria;
    adopcion.descripcion = descripcion || adopcion.descripcion;
    adopcion.imagen = imagen || adopcion.imagen;
    adopcion.peso = peso || adopcion.peso;
    adopcion.fechaNacimiento = fechaNacimiento || adopcion.fechaNacimiento;
    adopcion.vacunado = vacunado ?? adopcion.vacunado;
    adopcion.adoptable = adoptable ?? adopcion.adoptable;
    adopcion.esterilizado = esterilizado ?? adopcion.esterilizado;
    adopcion.actividad = actividad ?? adopcion.actividad;
    adopcion.socializacion = socializacion ?? adopcion.socializacion;
    adopcion.lat = lat ?? adopcion.lat; // Nuevo
    adopcion.lng = lng ?? adopcion.lng; // Nuevo
    adopcion.ubicacion = ubicacion ?? adopcion.ubicacion; // Nuevo

    await adopcion.save();

    res.json({
      data: adopcion,
      likesCount: adopcion.likes.length,
    });
  } catch (error) {
    console.error("Error al actualizar adopción:", error);
    res.status(500).json({ msg: "Error al actualizar adopción" });
  }
}

// Eliminar adopción - solo dueño
export async function eliminarAdopcion(req, res) {
  try {
    const adopcion = await Adopcion.findById(req.params.id);

    if (!adopcion) {
      return res.status(404).json({ msg: "Adopción no encontrada" });
    }

    if (adopcion.usuario.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    // Usar deleteOne() en lugar de remove()
    await Adopcion.deleteOne({ _id: req.params.id });

    res.json({ msg: "Adopción eliminada" });
  } catch (error) {
    console.error("Error al eliminar adopción:", error);
    res.status(500).json({ msg: "Error al eliminar adopción" });
  }
}

export async function agregarComentario(req, res) {
  try {
    const { comentario } = req.body;
    const adopcion = await Adopcion.findById(req.params.id);
    if (!adopcion)
      return res.status(404).json({ msg: "Adopción no encontrada" });

    adopcion.comentarios.push({
      usuario: req.user.id,
      texto: comentario,
      fecha: new Date(),
    });

    await adopcion.save();

    const adopcionConPopulated = await Adopcion.findById(adopcion._id)
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username");

    res.json(adopcionConPopulated);
  } catch (error) {
    console.error("Error agregando comentario:", error);
    res.status(500).json({ msg: "Error agregando comentario" });
  }
}

// Función para dar like o quitar like (toggle)
export async function toggleLike(req, res) {
  try {
    let adopcion = await Adopcion.findById(req.params.id);
    if (!adopcion)
      return res.status(404).json({ msg: "Adopción no encontrada" });

    const usuarioId = req.user.id;
    const index = adopcion.likes.indexOf(usuarioId);

    if (index === -1) {
      adopcion.likes.push(usuarioId); // Agregar like
    } else {
      adopcion.likes.splice(index, 1); // Quitar like
    }

    await adopcion.save();

    // Ahora recupera la adopción con los likes populados para obtener username e _id
    adopcion = await Adopcion.findById(adopcion._id)
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username"); // Popula los likes con username

    // Devuelve adopción completa + cantidad de likes
    res.json({
      data: adopcion,
      likesCount: adopcion.likes.length,
    });
  } catch (error) {
    console.error("Error en toggleLike:", error);
    res.status(500).json({ msg: "Error al dar like" });
  }
}
