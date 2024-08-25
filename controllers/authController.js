// src/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Registro de un nuevo usuario
export async function register(req, res) {
    const { username, password } = req.body;

    try {
        console.log('Datos recibidos:', req.body);

        const user = new User({ username, password });
        await user.save();

        console.log('Usuario creado:', user);
        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(400).json({ msg: 'Error al registrar usuario', error });
    }
}


// Login del usuario/admin
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario es el admin
        if (username === 'admin' && password === 'administrator') {
            const token = jwt.sign({ username: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, role: 'admin' });
        }

        // Verificar credenciales del usuario normal
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        // Generar token para el usuario
        const token = jwt.sign({ username: user.username, role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role, id: user._id }); // Enviar el ID del usuario también
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ msg: 'Error al autenticar usuario', error });
    }
}

