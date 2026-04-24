const colors = require('colors');

const errorHandler = (err, req, res, next) => {
  console.error(colors.red(`Error: ${err.message}`));

  if (err.name === 'ValidationError') {
    const mensaje = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({ mensaje, success: false });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ mensaje: 'ID no válido', success: false });
  }

  if (err.code === 11000) {
    return res.status(400).json({ mensaje: 'Este campo ya existe', success: false });
  }

  res.status(err.statusCode || 500).json({
    mensaje: err.message || 'Error interno del servidor', 
    success: false,
  });
};

module.exports = errorHandler;