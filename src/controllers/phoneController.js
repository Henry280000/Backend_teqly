const asyncHandler = require('express-async-handler');
const Phone = require('../models/Phone');
const colors = require('colors');

exports.obtenerTodos = asyncHandler(async (req, res) => {
  const { marca, precioMin, precioMax, ordenar } = req.query;
  let filtro = { estaDisponible: true };

  if (marca) {
    filtro.marca = { $regex: marca, $options: 'i' };
  }

  if (precioMin || precioMax) {
    filtro.precio = {};
    if (precioMin) filtro.precio.$gte = Number(precioMin);
    if (precioMax) filtro.precio.$lte = Number(precioMax);
  }

  let query = Phone.find(filtro);

  if (ordenar) {
    query = query.sort(ordenar.split(',').join(' '));
  } else {
    query = query.sort('-createdAt');
  }

  const telefonos = await query;

  res.status(200).json({
    success: true,
    total: telefonos.length,
    telefonos,
  });
});

exports.obtenerPorId = asyncHandler(async (req, res) => {
  const telefono = await Phone.findById(req.params.id).populate('creadoPor', 'nombre email');

  if (!telefono) {
    return res.status(404).json({
      mensaje: 'Teléfono no encontrado',
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    telefono,
  });
});

exports.crear = asyncHandler(async (req, res) => {
  const {
    marca,
    modelo,
    precio,
    almacenamiento,
    pantalla,
    procesador,
    ram,
    camaraTransera,
    camaraDelantera,
    bateria,
    sistemaOperativo,
    colorDisponibles,
    descripcion,
    imagen,
  } = req.body;

  if (!marca || !modelo || !precio) {
    return res.status(400).json({
      mensaje: 'Por favor proporciona marca, modelo y precio',
      success: false,
    });
  }

  const telefono = await Phone.create({
    marca,
    modelo,
    precio,
    almacenamiento,
    pantalla,
    procesador,
    ram,
    camaraTransera,
    camaraDelantera,
    bateria,
    sistemaOperativo,
    colorDisponibles: colorDisponibles || [],
    descripcion,
    imagen,
    creadoPor: req.usuario.id,
  });

  res.status(201).json({
    success: true,
    mensaje: 'Teléfono creado exitosamente',
    telefono,
  });

  console.log(colors.green(`✓ Teléfono creado: ${marca} ${modelo}`));
});

exports.actualizar = asyncHandler(async (req, res) => {
  let telefono = await Phone.findById(req.params.id);

  if (!telefono) {
    return res.status(404).json({
      mensaje: 'Teléfono no encontrado',
      success: false,
    });
  }

  telefono = await Phone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    mensaje: 'Teléfono actualizado exitosamente',
    telefono,
  });

  console.log(colors.yellow(`✓ Teléfono actualizado: ${telefono.marca} ${telefono.modelo}`));
});

exports.eliminar = asyncHandler(async (req, res) => {
  const telefono = await Phone.findById(req.params.id);

  if (!telefono) {
    return res.status(404).json({
      mensaje: 'Teléfono no encontrado',
      success: false,
    });
  }

  await Phone.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    mensaje: 'Teléfono eliminado exitosamente',
  });

  console.log(colors.red(`✓ Teléfono eliminado: ${telefono.marca} ${telefono.modelo}`));
});

exports.buscar = asyncHandler(async (req, res) => {
  const { q, campo } = req.query;

  if (!q) {
    return res.status(400).json({
      mensaje: 'Por favor proporciona un término de búsqueda',
      success: false,
    });
  }

  let filtro = {
    estaDisponible: true,
    $or: [
      { marca: { $regex: q, $options: 'i' } },
      { modelo: { $regex: q, $options: 'i' } },
      { descripcion: { $regex: q, $options: 'i' } },
    ],
  };

  const telefonos = await Phone.find(filtro);

  res.status(200).json({
    success: true,
    total: telefonos.length,
    telefonos,
  });
});
