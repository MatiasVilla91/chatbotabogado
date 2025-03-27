const mongoose = require("mongoose");

const MensajeSchema = new mongoose.Schema({
  tipo: { type: String, enum: ["sent", "received"], required: true },
  texto: String,
  hora: String
});

const ChatLegalSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mensajes: [MensajeSchema],
  creado: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatLegal", ChatLegalSchema);
