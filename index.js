const express = require('express');
const cors = require('cors');
const colors = require('colors');
require('dotenv').config();

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');
const { PORT, NODE_ENV, CORS_ORIGIN } = require('./src/config/environment');

const userRoutes = require('./src/routes/userRoutes');
const phoneRoutes = require('./src/routes/phoneRoutes');
const productoRoutes = require('./src/routes/productoRoutes');

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.use('/api/usuarios', userRoutes);
app.use('/api/telefonos', phoneRoutes);
app.use('/api/productos', productoRoutes);

app.get('/api/salud', (req, res) => {
  res.status(200).json({
    success: true,
    mensaje: 'Servidor funcionando correctamente',
    fecha: new Date().toLocaleString('es-ES'),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada',
  });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(colors.green(`✓ Servidor iniciado en puerto ${PORT}`));
});

process.on('unhandledRejection', (err) => {
  console.error(colors.red(`Error no manejado: ${err.message}`));
  server.close(() => process.exit(1));
});

module.exports = app;
