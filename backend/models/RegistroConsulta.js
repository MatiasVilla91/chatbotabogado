// models/RegistroConsulta.js
const mongoose = require('mongoose');

const RegistroConsultaSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nombre: String,
  username: String,
  telefono: String,
  texto: {
    type: String,
    required: true
  },
  hora: String,
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RegistroConsulta', RegistroConsultaSchema);
