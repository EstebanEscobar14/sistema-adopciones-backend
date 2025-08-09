import { connect } from "mongoose";
import configDotenv from "dotenv";

// Cargar variables de entorno desde 'variables.env'
configDotenv.config({ path: "variables.env" });

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    console.log(
      `Conectando a la base de datos en host: ${
        process.env.DB_MONGO.split("@")[1]
      }`
    );

    // Conexión con Mongoose
    await connect(process.env.DB_MONGO);
    console.log("DB conectada");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Detener la app si hay un error grave
  }
};

export default connectDB;
