// src/controllers/authController.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Registro de un nuevo usuario
export async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Username y password son obligatorios" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ msg: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
}

// Login del usuario/admin
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { username: user.username, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, refreshToken, role: user.role, id: user._id });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ msg: "Error al autenticar usuario" });
  }
  
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'No refresh token provided' });
  }

  try {
    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: 'Usuario no encontrado' });
    }

    // Generar un nuevo access token
    const newAccessToken = jwt.sign(
      { username: user.username, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(403).json({ msg: 'Invalid refresh token' });
  }
}
