// models/Contrato.js
const mongoose = require('mongoose');

const ContratoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String }, // opcional: "locación", "servicio", etc.
    mensaje_original: { type: String, required: true },
    contrato_generado: { type: String, required: true },
    ruta_pdf: { type: String }, // si querés guardar la ruta del PDF
}, {
    timestamps: true,
    collection: 'contratos'
});

module.exports = mongoose.model('Contrato', ContratoSchema);
