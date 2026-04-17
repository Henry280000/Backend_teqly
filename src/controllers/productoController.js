const Producto = require('../models/Producto');
const asyncHandler = require('express-async-handler');

exports.obtenerTodos = asyncHandler(async (req, res) => {
  const { categoria, marca, ordenarPor } = req.query;
  let filtro = {};

  if (categoria) filtro.categoria = categoria;
  if (marca) filtro.marca = marca;

  let query = Producto.find(filtro);

  if (ordenarPor === 'precio-asc') query = query.sort({ precio: 1 });
  else if (ordenarPor === 'precio-desc') query = query.sort({ precio: -1 });
  else if (ordenarPor === 'nombre') query = query.sort({ nombre: 1 });
  else query = query.sort({ createdAt: -1 });

  const productos = await query;

  res.status(200).json({
    success: true,
    cantidad: productos.length,
    data: productos,
  });
});

exports.obtenerPorId = asyncHandler(async (req, res) => {
  const producto = await Producto.findById(req.params.id);

  if (!producto) {
    return res.status(404).json({
      success: false,
      mensaje: 'Producto no encontrado',
    });
  }

  res.status(200).json({
    success: true,
    data: producto,
  });
});

exports.obtenerPorCategoria = asyncHandler(async (req, res) => {
  const { categoria } = req.params;

  const productos = await Producto.find({ categoria }).sort({ nombre: 1 });

  if (productos.length === 0) {
    return res.status(404).json({
      success: false,
      mensaje: `No hay productos en la categoría: ${categoria}`,
    });
  }

  res.status(200).json({
    success: true,
    categoria,
    cantidad: productos.length,
    data: productos,
  });
});

exports.buscar = asyncHandler(async (req, res) => {
  const { q, categoria } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      mensaje: 'Parámetro de búsqueda requerido (q)',
    });
  }

  let filtro = {
    $or: [
      { nombre: { $regex: q, $options: 'i' } },
      { marca: { $regex: q, $options: 'i' } },
      { descripcion: { $regex: q, $options: 'i' } },
    ],
  };

  if (categoria) filtro.categoria = categoria;

  const productos = await Producto.find(filtro);

  res.status(200).json({
    success: true,
    cantidad: productos.length,
    data: productos,
  });
});

exports.crear = asyncHandler(async (req, res) => {
  const producto = await Producto.create(req.body);

  res.status(201).json({
    success: true,
    mensaje: 'Producto creado exitosamente',
    data: producto,
  });
});

exports.actualizar = asyncHandler(async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!producto) {
    return res.status(404).json({
      success: false,
      mensaje: 'Producto no encontrado',
    });
  }

  res.status(200).json({
    success: true,
    mensaje: 'Producto actualizado exitosamente',
    data: producto,
  });
});

exports.eliminar = asyncHandler(async (req, res) => {
  const producto = await Producto.findByIdAndDelete(req.params.id);

  if (!producto) {
    return res.status(404).json({
      success: false,
      mensaje: 'Producto no encontrado',
    });
  }

  res.status(200).json({
    success: true,
    mensaje: 'Producto eliminado exitosamente',
  });
});

exports.estadisticas = asyncHandler(async (req, res) => {
  const stats = await Producto.aggregate([
    {
      $group: {
        _id: '$categoria',
        total: { $sum: 1 },
        precioPromedio: { $avg: '$precio' },
        precioMin: { $min: '$precio' },
        precioMax: { $max: '$precio' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
