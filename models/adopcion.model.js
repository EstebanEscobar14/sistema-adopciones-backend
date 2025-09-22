import { Schema, model } from "mongoose";

const ComentarioSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const AdopcionSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
    nombre: { type: String, required: true },
    raza: { type: String, required: true },
    categoria: { type: String, required: true },
    imagen: { type: String },
    descripcion: { type: String, required: true },
    peso: { type: Number, required: true },
    fechaNacimiento: { type: Date },
    fechaCreacion: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
    comentarios: [ComentarioSchema],
    vacunado: { type: Boolean, default: false },
    adoptable: { type: Boolean, default: true },
    estado: {
      type: String,
      enum: ["Disponible", "Adoptada"],
      default: "Disponible",
      required: true,
    },
    esterilizado: { type: Boolean, default: false },
    actividad: { type: Number, min: 0, max: 10 },
    socializacion: { type: Number, min: 0, max: 5 },
    lat: { type: Number }, // Latitud
    lng: { type: Number }, // Longitud
    ubicacion: { type: String }, // Nuevo: Dirección formateada
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default model("Adopcion", AdopcionSchema);
