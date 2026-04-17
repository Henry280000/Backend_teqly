const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'La marca del teléfono es requerida'],
      trim: true,
    },
    modelo: {
      type: String,
      required: [true, 'El modelo del teléfono es requerido'],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: 0,
    },
    almacenamiento: {
      type: String,
      required: true, 
    },
    pantalla: {
      type: String,
      required: true, 
    },
    procesador: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true, 
    },
    camaraTransera: {
      type: String,
      required: true, 
    },
    camaraDelantera: {
      type: String,
      required: true, 
    },
    bateria: {
      type: String,
      required: true, 
    },
    sistemaOperativo: {
      type: String,
      required: true, 
    },
    colorDisponibles: [
      {
        type: String,
      },
    ],
    descripcion: {
      type: String,
      minlength: 10,
    },
    imagen: {
      type: String, 
    },
    estaDisponible: {
      type: Boolean,
      default: true,
    },
    calificacion: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numeroResenas: {
      type: Number,
      default: 0,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Índices para búsquedas rápidas
phoneSchema.index({ marca: 1 });
phoneSchema.index({ precio: 1 });
phoneSchema.index({ procesador: 1 });

module.exports = mongoose.model('Phone', phoneSchema);
