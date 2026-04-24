const Producto = require('../models/Producto');

exports.obtenerTodos = async (req, res, next) => {
  try {
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
    res.status(200).json({ success: true, cantidad: productos.length, data: productos });
  } catch (err) { next(err); }
};

exports.obtenerPorId = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
    res.status(200).json({ success: true, data: producto });
  } catch (err) { next(err); }
};

exports.obtenerPorCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params;
    const productos = await Producto.find({ categoria }).sort({ nombre: 1 });
    if (productos.length === 0) return res.status(404).json({ success: false, mensaje: `No hay productos en la categoría: ${categoria}` });
    res.status(200).json({ success: true, categoria, cantidad: productos.length, data: productos });
  } catch (err) { next(err); }
};

exports.buscar = async (req, res, next) => {
  try {
    const { q, categoria } = req.query;
    if (!q) return res.status(400).json({ success: false, mensaje: 'Parámetro de búsqueda requerido (q)' });
    let filtro = {
      $or: [
        { nombre: { $regex: q, $options: 'i' } },
        { marca: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } },
      ],
    };
    if (categoria) filtro.categoria = categoria;
    const productos = await Producto.find(filtro);
    res.status(200).json({ success: true, cantidad: productos.length, data: productos });
  } catch (err) { next(err); }
};

exports.crear = async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json({ success: true, mensaje: 'Producto creado exitosamente', data: producto });
  } catch (err) { next(err); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) return res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
    res.status(200).json({ success: true, mensaje: 'Producto actualizado exitosamente', data: producto });
  } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
    res.status(200).json({ success: true, mensaje: 'Producto eliminado exitosamente' });
  } catch (err) { next(err); }
};

exports.estadisticas = async (req, res, next) => {
  try {
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
    res.status(200).json({ success: true, data: stats });
  } catch (err) { next(err); }
};