const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 👇 Agregamos estos campos
    esPremium: { type: Boolean, default: false },
    consultasRestantes: { type: Number, default: 5 },
    contratosRestantes: { type: Number, default: 3 }

}, { timestamps: true,
    collection: 'usuarios' // 👈 Forzar el nombre de la colección
 });

// Especificamos explícitamente la colección 'usuarios'
module.exports = mongoose.model('User', UserSchema, 'usuarios');