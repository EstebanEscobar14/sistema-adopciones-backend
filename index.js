import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adopcionRoutes from './routes/adopcion.js';
import reservaRoutes from './routes/reservaRoutes.js';
import cors from 'cors';

// Creamos el servidor
const app = express();

// Conectamos a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200', // Permite solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Definir la ruta base correctamente
app.use('/api/adopcion', adopcionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reserva', reservaRoutes);

// Levantamos el servidor
app.listen(4000, () => {
    console.log('Servidor levantado');
});
