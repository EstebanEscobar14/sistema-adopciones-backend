import { Schema, model } from "mongoose";

const ReservaSchema = new Schema({
  idUsuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 18,
  },
  ciudad: {
    type: String,
    required: true,
  },
  fechaVisita: {
    type: Date,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  adopcionId: {
    type: Schema.Types.ObjectId,
    ref: "Adopcion",
    required: true,
  },
  estado: {
    type: String,
    enum: ["Solicitado", "Visita Realizada", "Exitosa", "No Exitosa"],
    default: "Solicitado",
    required: true,
  },
});

export default model("Reserva", ReservaSchema);
