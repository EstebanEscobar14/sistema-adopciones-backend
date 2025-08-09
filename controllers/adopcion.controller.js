import Adopcion from "../models/adopcion.model.js";

// Crear adopción
export async function crearAdopcion(req, res) {
  try {
    const nuevaAdopcion = new Adopcion({
      usuario: req.user.id,
      ...req.body,
    });

    await nuevaAdopcion.save();

    res.status(201).json({
      status: 201,
      message: "Adopción creada exitosamente",
      data: nuevaAdopcion,
    });
  } catch (error) {
    console.error("Error al crear adopción:", error);
    res.status(500).json({ msg: "Error al crear adopción" });
  }
}

// Obtener todas las adopciones (de todos)
export async function obtenerAdopciones(req, res) {
  try {
    const adopciones = await Adopcion.find()
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username")
      .sort({ fechaCreacion: -1 });

    // Agregar likesCount a cada adopción
    const resultado = adopciones.map((adopcion) => ({
      data: adopcion,
      likesCount: adopcion.likes.length,
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener adopciones:", error);
    res.status(500).json({ msg: "Error al obtener adopciones" });
  }
}

// Obtener adopciones solo del usuario autenticado (opcional)
export async function obtenerAdopcionesUsuario(req, res) {
  try {
    const adopciones = await Adopcion.find({ usuario: req.user.id })
      .populate("usuario", "username")
      .populate("comentarios.usuario", "username")
      .populate("likes", "username")
      .sort({ fechaCreacion: -1 });

    const resultado = adopciones.map(adopcion => ({
      data: adopcion,
      likesCount: adopcion.likes.length,
    }));

    res.json(resultado);
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

    if (!adopcion)
      return res.status(404).json({ msg: "Adopción no encontrada" });

    if (adopcion.usuario._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    const { nombre, raza, categoria, imagen, peso, descripcion } = req.body;

    adopcion.nombre = nombre || adopcion.nombre;
    adopcion.raza = raza || adopcion.raza;
    adopcion.categoria = categoria || adopcion.categoria;
    adopcion.descripcion = descripcion || adopcion.descripcion;
    adopcion.imagen = imagen || adopcion.imagen;
    adopcion.peso = peso || adopcion.peso;

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

    if (!adopcion)
      return res.status(404).json({ msg: "Adopción no encontrada" });

    if (adopcion.usuario.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    await adopcion.remove();

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
