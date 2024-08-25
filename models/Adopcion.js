import { Schema, model } from 'mongoose';
const AdopcionSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },
    ubicacion: {
        type: String,
        required: true
    },
    peso: {
        type: Number,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

export default model('Adopcion', AdopcionSchema);