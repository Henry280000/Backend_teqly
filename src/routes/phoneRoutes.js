const express = require('express');
const router = express.Router();
const { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, buscar } = require('../controllers/phoneController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', obtenerTodos);
router.get('/buscar', buscar);
router.get('/:id', obtenerPorId);
router.post('/', protect, admin, crear);
router.put('/:id', protect, admin, actualizar);
router.delete('/:id', protect, admin, eliminar);

module.exports = router;
