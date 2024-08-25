import { connect } from 'mongoose'; // Importar la función de conexión de Mongoose
import configDotenv from 'dotenv'; // Importar dotenv para gestionar variables de entorno
import User from '../models/User.js'; // Importar el modelo de usuario

// Configurar dotenv para cargar variables de entorno desde 'variables.env'
configDotenv.config({ path: 'variables.env' });

// Función asíncrona para conectar a la base de datos
const connectDB = async () => {
    try {
        // Mensajes de log para seguimiento
        console.log('Conectando a la base de datos...');
        console.log('URI de conexión:', process.env.DB_MONGO);

        // Intentar conectar a la base de datos usando Mongoose
        await connect(process.env.DB_MONGO);
        console.log('DB conectada');

        // Llamar a la función para crear el usuario administrador si no existe
        await createAdminUser();
    } catch (error) {
        // Capturar y loguear cualquier error durante la conexión a la base de datos
        console.log('Error al conectar a la base de datos:', error);
        process.exit(1); // Detener la aplicación en caso de error crítico
    }
}

// Función asíncrona para crear un usuario administrador si no existe
const createAdminUser = async () => {
    try {
        const adminUsername = 'admin'; // Nombre de usuario del administrador
        const adminPassword = 'administrator'; // Contraseña del administrador (asegúrate de encriptarla)
        const adminRole = 'admin'; // Rol del usuario administrador

        // Buscar un usuario con el nombre de usuario del administrador
        let user = await User.findOne({ username: adminUsername });

        // Si no se encuentra el usuario, crear uno nuevo
        if (!user) {
            user = new User({
                username: adminUsername,
                password: adminPassword,
                role: adminRole
            });

            // Guardar el nuevo usuario administrador en la base de datos
            await user.save();
            console.log('Usuario administrador creado.');
        } else {
            console.log('El usuario administrador ya existe.');
        }
    } catch (error) {
        // Capturar y loguear cualquier error durante la creación del usuario administrador
        console.error('Error al crear el usuario administrador:', error);
    }
};

// Exportar la función de conexión a la base de datos como el módulo predeterminado
export default connectDB;
