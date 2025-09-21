import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
    crearAdopcion,
    obtenerAdopciones,
    obtenerAdopcion,
    actualizarAdopcion,
    eliminarAdopcion,
    toggleLike,
    agregarComentario,
    obtenerAdopcionesUsuario
} from "../controllers/adopcion.controller.js";
import Adopcion from "../models/adopcion.model.js";


const router = Router();


router.get("/", obtenerAdopciones);
router.get("/usuario", authenticateToken, obtenerAdopcionesUsuario); // publicaciones propias
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const total = await Adopcion.countDocuments();

    const categorias = await Adopcion.aggregate([
      { $group: { _id: "$categoria", count: { $sum: 1 } } }
    ]);

    const likes = await Adopcion.aggregate([
      { $project: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } }
    ]);

    const recientes = await Adopcion.find()
      .sort({ fechaCreacion: -1 })
      .limit(5)
      .select("nombre categoria imagen fechaCreacion");

    res.json({
      totalAdopciones: total,
      categorias,
      totalLikes: likes[0]?.totalLikes || 0,
      recientes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", obtenerAdopcion);

router.post("/", authenticateToken, crearAdopcion);
router.put("/:id", authenticateToken, actualizarAdopcion);
router.delete("/:id", authenticateToken, eliminarAdopcion);

router.put("/:id/like", authenticateToken, toggleLike);
router.post("/:id/comentario", authenticateToken, agregarComentario);

export default router;
