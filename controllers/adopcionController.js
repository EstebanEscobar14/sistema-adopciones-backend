import Adopcion from "../models/Adopcion.js";

// Crear una nueva adopción
export async function crearAdopcion(req, res) {
    try {
        // Crear una nueva instancia del modelo Adopcion con los datos del cuerpo de la solicitud
        const adopcion = new Adopcion(req.body);

        // Guardar la nueva adopción en la base de datos
        await adopcion.save();

        // Responder con el estado 201 (Creado) y el documento de adopción creado
        res.status(201).json(adopcion);
    } catch (error) {
        // Imprimir el error en la consola para depuración
        console.error("Error al crear adopción:", error);

        // Responder con el estado 500 (Error interno del servidor) y un mensaje de error
        res.status(500).json({ msg: "Error al crear adopción" });
    }
}

// Obtener todas las adopciones
export async function obtenerAdopciones(req, res) {
    try {
        // Buscar todas las adopciones en la base de datos
        const adopciones = await Adopcion.find();

        // Responder con el estado 200 (por defecto) y la lista de adopciones
        res.json(adopciones);
    } catch (error) {
        // Imprimir el error en la consola para depuración
        console.error("Error al obtener adopciones:", error);

        // Responder con el estado 500 (Error interno del servidor) y un mensaje de error
        res.status(500).json({ msg: "Error al obtener adopciones" });
    }
}

// Actualizar una adopción
export async function actualizarAdopcion(req, res) {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { nombre, categoria, ubicacion, peso } = req.body;

        // Buscar y actualizar la adopción en una sola operación
        const adopcion = await Adopcion.findOneAndUpdate(
            { _id: req.params.id }, // Filtro para encontrar la adopción por ID
            { nombre, categoria, ubicacion, peso }, // Datos a actualizar
            { new: true } // Opciones: devolver el documento actualizado
        );

        // Verificar si la adopción fue encontrada y actualizada
        if (!adopcion) {
            return res.status(404).json({ msg: "Adopción no encontrada" });
        }

        // Responder con el estado 200 y el documento actualizado
        res.json(adopcion);
    } catch (error) {
        // Imprimir el error en la consola para depuración
        console.error("Error al actualizar adopción:", error);

        // Responder con el estado 500 (Error interno del servidor) y un mensaje de error
        res.status(500).json({ msg: "Error al actualizar adopción" });
    }
}

// Obtener una adopción por ID
export async function obtenerAdopcion(req, res) {
    try {
        // Buscar una adopción en la base de datos por ID
        const adopcion = await Adopcion.findById(req.params.id);

        // Verificar si la adopción fue encontrada
        if (!adopcion) {
            return res.status(404).json({ msg: "Adopción no encontrada" });
        }

        // Responder con el estado 200 y el documento de adopción
        res.json(adopcion);
    } catch (error) {
        // Imprimir el error en la consola para depuración
        console.error("Error al obtener adopción:", error);

        // Responder con el estado 500 (Error interno del servidor) y un mensaje de error
        res.status(500).json({ msg: "Error al obtener adopción" });
    }
}

// Eliminar una adopción por ID
export async function eliminarAdopcion(req, res) {
    try {
        // Buscar y eliminar la adopción en una sola operación
        const adopcion = await Adopcion.findByIdAndDelete(req.params.id);

        // Verificar si la adopción fue encontrada y eliminada
        if (!adopcion) {
            return res.status(404).json({ msg: "Adopción no encontrada" });
        }

        // Responder con el estado 200 y un mensaje de éxito
        res.json({ msg: "Adopción eliminada" });
    } catch (error) {
        // Imprimir el error en la consola para depuración
        console.error("Error al eliminar adopción:", error);

        // Responder con el estado 500 (Error interno del servidor) y un mensaje de error
        res.status(500).json({ msg: "Error al eliminar adopción" });
    }
}
