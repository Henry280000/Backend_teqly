const express = require('express');
const router = express.Router();
const { busquedaInteligente, marcasPorCategoria } = require('../controllers/smartSearchController');

router.get('/buscar', busquedaInteligente);
router.get('/marcas/:categoria', marcasPorCategoria);

module.exports = router;