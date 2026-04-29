const Producto = require('../models/Producto');

const eliminarAcentos = (texto) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

exports.busquedaInteligente = async (req, res) => {
  try {
    const { categoria, presupuestoMin, presupuestoMax, marca, busqueda } = req.query;

    if (!categoria) {
      return res.status(400).json({ success: false, mensaje: 'La categoría es requerida' });
    }

    // Construir filtro base
    let filtro = { categoria, disponible: true };

    if (presupuestoMin || presupuestoMax) {
      filtro.precio = {};
      if (presupuestoMin) filtro.precio.$gte = Number(presupuestoMin);
      if (presupuestoMax) filtro.precio.$lte = Number(presupuestoMax);
    }

    if (marca) filtro.marca = marca;

    if (busqueda) {
      const regex = new RegExp(eliminarAcentos(busqueda), 'i');
      filtro.$or = [
        { nombre: regex },
        { marca: regex },
        { descripcion: regex },
        { caracteristicas_especiales: { $elemMatch: { $regex: regex } } },
        { procesador: regex },
        { sistema_operativo: regex },
      ];
    }

    const productos = await Producto.find(filtro);

    // Scoring: relación calidad-precio
    const palabrasBusqueda = busqueda
      ? eliminarAcentos(busqueda.toLowerCase()).split(' ').filter(p => p.length > 0)
      : [];

    const productosConScore = productos.map((producto) => {
      const numCaract = producto.caracteristicas_especiales?.length || 0;
      let score = numCaract > 0 ? (numCaract / (producto.precio / 1000)) : 0;

      // Bonus por coincidencia en características con la búsqueda
      if (palabrasBusqueda.length > 0) {
        const coincidencias = producto.caracteristicas_especiales?.filter(caract =>
          palabrasBusqueda.some(palabra =>
            eliminarAcentos(caract.toLowerCase()).includes(palabra)
          )
        ).length || 0;
        score = score * (1 + coincidencias * 2);
      }

      return { ...producto.toObject(), score };
    });

    // Ordenar por score y tomar top 5
    const top5 = productosConScore
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      cantidad: top5.length,
      data: top5,
    });
  } catch (err) {
    return res.status(500).json({ success: false, mensaje: err.message });
  }
};

// Obtener marcas disponibles por categoría
exports.marcasPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    if (!categoria) {
      return res.status(400).json({ success: false, mensaje: 'Categoría requerida' });
    }
    const marcas = await Producto.distinct('marca', { categoria, disponible: true });
    res.status(200).json({ success: true, data: marcas.sort() });
  } catch (err) {
    return res.status(500).json({ success: false, mensaje: err.message });
  }
};