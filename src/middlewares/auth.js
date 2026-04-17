const jwt = require('jsonwebtoken');
const colors = require('colors');
const { JWT_SECRET } = require('../config/environment');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado - Token no proporcionado', success: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error(colors.red(`Error JWT: ${error.message}`));
    return res.status(401).json({ mensaje: 'Token no válido', success: false });
  }
};

const admin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ mensaje: 'Solo administradores', success: false });
  }
};

module.exports = { protect, admin };
