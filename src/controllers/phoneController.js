const Phone = require('../models/Phone');
const colors = require('colors');

exports.obtenerTodos = async (req, res, next) => {
  try {
    const { marca, precioMin, precioMax, ordenar } = req.query;
    let filtro = { estaDisponible: true };
    if (marca) filtro.marca = { $regex: marca, $options: 'i' };
    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) filtro.precio.$gte = Number(precioMin);
      if (precioMax) filtro.precio.$lte = Number(precioMax);
    }
    let query = Phone.find(filtro);
    query = ordenar ? query.sort(ordenar.split(',').join(' ')) : query.sort('-createdAt');
    const telefonos = await query;
    res.status(200).json({ success: true, total: telefonos.length, telefonos });
  } catch (err) { next(err); }
};

exports.obtenerPorId = async (req, res, next) => {
  try {
    const telefono = await Phone.findById(req.params.id).populate('creadoPor', 'nombre email');
    if (!telefono) return res.status(404).json({ mensaje: 'Teléfono no encontrado', success: false });
    res.status(200).json({ success: true, telefono });
  } catch (err) { next(err); }
};

exports.crear = async (req, res, next) => {
  try {
    const { marca, modelo, precio, almacenamiento, pantalla, procesador, ram,
      camaraTransera, camaraDelantera, bateria, sistemaOperativo, colorDisponibles, descripcion, imagen } = req.body;
    if (!marca || !modelo || !precio) return res.status(400).json({ mensaje: 'Por favor proporciona marca, modelo y precio', success: false });
    const telefono = await Phone.create({
      marca, modelo, precio, almacenamiento, pantalla, procesador, ram,
      camaraTransera, camaraDelantera, bateria, sistemaOperativo,
      colorDisponibles: colorDisponibles || [], descripcion, imagen, creadoPor: req.usuario.id,
    });
    res.status(201).json({ success: true, mensaje: 'Teléfono creado exitosamente', telefono });
    console.log(colors.green(`✓ Teléfono creado: ${marca} ${modelo}`));
  } catch (err) { next(err); }
};

exports.actualizar = async (req, res, next) => {
  try {
    let telefono = await Phone.findById(req.params.id);
    if (!telefono) return res.status(404).json({ mensaje: 'Teléfono no encontrado', success: false });
    telefono = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, mensaje: 'Teléfono actualizado exitosamente', telefono });
    console.log(colors.yellow(`✓ Teléfono actualizado: ${telefono.marca} ${telefono.modelo}`));
  } catch (err) { next(err); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const telefono = await Phone.findById(req.params.id);
    if (!telefono) return res.status(404).json({ mensaje: 'Teléfono no encontrado', success: false });
    await Phone.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, mensaje: 'Teléfono eliminado exitosamente' });
    console.log(colors.red(`✓ Teléfono eliminado: ${telefono.marca} ${telefono.modelo}`));
  } catch (err) { next(err); }
};

exports.buscar = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ mensaje: 'Por favor proporciona un término de búsqueda', success: false });
    const filtro = {
      estaDisponible: true,
      $or: [
        { marca: { $regex: q, $options: 'i' } },
        { modelo: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } },
      ],
    };
    const telefonos = await Phone.find(filtro);
    res.status(200).json({ success: true, total: telefonos.length, telefonos });
  } catch (err) { next(err); }
};