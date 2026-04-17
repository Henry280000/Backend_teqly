const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/environment');
const colors = require('colors');

// Generar JWT
const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

exports.registro = asyncHandler(async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  if (!nombre || !email || !contraseña) {
    return res.status(400).json({
      mensaje: 'Por favor proporciona nombre, email y contraseña',
      success: false,
    });
  }

  let usuario = await User.findOne({ email });
  if (usuario) {
    return res.status(400).json({
      mensaje: 'El usuario ya existe',
      success: false,
    });
  }

  usuario = await User.create({ nombre, email, contraseña });
  const token = generarToken(usuario._id, usuario.rol);

  res.status(201).json({
    success: true,
    mensaje: 'Usuario registrado exitosamente',
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });

  console.log(colors.green(`✓ Nuevo usuario: ${email}`));
});

exports.login = asyncHandler(async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({
      mensaje: 'Por favor proporciona email y contraseña',
      success: false,
    });
  }

  // select: false para obtener contraseña (se excluye por defecto en queries)
  const usuario = await User.findOne({ email }).select('+contraseña');

  if (!usuario) {
    return res.status(401).json({
      mensaje: 'Credenciales inválidas',
      success: false,
    });
  }

  const esValida = await usuario.matchContraseña(contraseña);
  if (!esValida) {
    return res.status(401).json({
      mensaje: 'Credenciales inválidas',
      success: false,
    });
  }

  const token = generarToken(usuario._id, usuario.rol);

  res.status(200).json({
    success: true,
    mensaje: 'Sesión iniciada exitosamente',
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });

  console.log(colors.green(`✓ Sesión iniciada: ${email}`));
});

exports.miPerfil = asyncHandler(async (req, res) => {
  const usuario = await User.findById(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({
      mensaje: 'Usuario no encontrado',
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    usuario,
  });
});

exports.obtenerTodos = asyncHandler(async (req, res) => {
  const usuarios = await User.find();

  res.status(200).json({
    success: true,
    total: usuarios.length,
    usuarios,
  });
});
