import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import adopcionRoutes from "./routes/adopcion.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import cors from "cors";

// Creamos el servidor
const app = express();

// Conectamos a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());
// Aumentar el límite de tamaño del cuerpo de la solicitud
app.use(express.json({ limit: '10mb' })); // Aumenta a 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Lista de orígenes permitidos
const allowedOrigins = [
  "http://localhost:4200",
  "https://sistema-adopcion.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Registrar rutas
app.use("/api/adopcion", adopcionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reserva", reservaRoutes);

// Levantamos el servidor
app.listen(4000, () => {
  console.log("Servidor levantado");
});
