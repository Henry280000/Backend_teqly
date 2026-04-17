const express = require('express');
const router = express.Router();
const { registro, login, miPerfil, obtenerTodos } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/auth');

router.post('/registro', registro);
router.post('/login', login);
router.get('/miPerfil', protect, miPerfil);
router.get('/', protect, admin, obtenerTodos);

module.exports = router;
