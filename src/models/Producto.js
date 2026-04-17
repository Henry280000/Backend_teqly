const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    categoria: {
      type: String,
      enum: ['celulares', 'tablets', 'monitores', 'teclados', 'ratones', 'audifonos'],
      required: [true, 'La categoría es requerida'],
      index: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      index: true,
    },
    marca: {
      type: String,
      required: [true, 'La marca es requerida'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      index: true,
    },
    imagen: String,
    // Campos específicos para celulares y tablets
    sistema_operativo: String,
    procesador: String,
    ram: String,
    almacenamiento: String,
    pantalla: String,
    camara: String,
    bateria: String,
    // Campos específicos para monitores
    resolucion: String,
    tamaño_pantalla: String,
    panel_type: String,
    tasa_refresco: String,
    tiempo_respuesta: String,
    // Campos específicos para teclados
    tipo: String,
    conexion: String,
    iluminacion: String,
    idioma: String,
    // Campos específicos para ratones
    sensor: String,
    dpi: String,
    ergonomia: String,
    botones: String,
    // Campos específicos para audífonos
    conductores: String,
    impedancia: String,
    rango_frecuencia: String,
    frecuencia_respuesta: String,
    noise_cancellation: String,
    //
    caracteristicas_especiales: [String],
    descripcion: String,
    id_original: Number, // Para mantener ref del JSON original
    calificacion: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    resenas: Number,
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Índices para búsquedas
productoSchema.index({ categoria: 1, marca: 1 });
productoSchema.index({ categoria: 1, precio: 1 });
productoSchema.index({ nombre: 'text', marca: 'text' });

module.exports = mongoose.model('Producto', productoSchema);
