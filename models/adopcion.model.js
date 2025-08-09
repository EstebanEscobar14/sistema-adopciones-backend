import { Schema, model } from "mongoose";

const ComentarioSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const AdopcionSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  nombre: { type: String, required: true },
  raza: { type: String, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String },
  descripcion: { type: String, required: true },
  peso: { type: Number, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  comentarios: [ComentarioSchema],
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

export default model("Adopcion", AdopcionSchema);
