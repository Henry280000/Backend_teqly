const express = require('express');
const router = express.Router();
const { obtenerTodos, obtenerPorId, obtenerPorCategoria, buscar, crear, actualizar, eliminar, estadisticas } = require('../controllers/productoController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', obtenerTodos);
router.get('/estadisticas', estadisticas);
router.get('/categoria/:categoria', obtenerPorCategoria);
router.get('/buscar', buscar);
router.get('/:id', obtenerPorId);
router.post('/', protect, admin, crear);
router.put('/:id', protect, admin, actualizar);
router.delete('/:id', protect, admin, eliminar);

module.exports = router;
