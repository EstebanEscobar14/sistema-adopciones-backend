import jwt from 'jsonwebtoken'; // Importar jsonwebtoken para manejar tokens JWT

// Middleware para autenticar el token JWT
export const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado 'authorization' y separar el esquema 'Bearer'
    const token = req.headers['authorization']?.split(' ')[1];

    // Si no hay token, responder con un estado 401 (No autorizado)
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    // Verificar el token usando la clave secreta almacenada en las variables de entorno
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Si el token es inválido, responder con un estado 403 (Prohibido)
        if (err) return res.status(403).json({ msg: 'Invalid token' });
        
        // Si el token es válido, agregar el objeto 'user' a la solicitud (req)
        req.user = user;
        
        // Continuar con la siguiente función middleware
        next();
    });
};

// Middleware para autorizar a usuarios con el rol de administrador
export const authorizeAdmin = (req, res, next) => {
    // Verificar si el rol del usuario no es 'admin'
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    // Si el usuario es un administrador, continuar con la siguiente función middleware
    next();
};
