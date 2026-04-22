const express = require('express');
const router = express.Router();
const { registro, login, miPerfil, obtenerTodos, actualizar, eliminar } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/auth');

router.post('/registro', registro);
router.post('/login', login);
router.get('/miPerfil', protect, miPerfil);
router.get('/', protect, admin, obtenerTodos);
router.put('/:id', protect, admin, actualizar);
router.delete('/:id', protect, admin, eliminar);

module.exports = router;
