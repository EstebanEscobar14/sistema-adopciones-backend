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

const router = Router();

router.get("/", obtenerAdopciones);
router.get("/usuario", authenticateToken, obtenerAdopcionesUsuario); // publicaciones propias
router.get("/:id", obtenerAdopcion);

router.post("/", authenticateToken, crearAdopcion);
router.put("/:id", authenticateToken, actualizarAdopcion);
router.delete("/:id", authenticateToken, eliminarAdopcion);

router.put("/:id/like", authenticateToken, toggleLike);
router.post("/:id/comentario", authenticateToken, agregarComentario);

export default router;
