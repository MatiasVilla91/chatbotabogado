const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // Contraseña: solo si no es login con Google
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },

  googleId: { type: String, unique: true, sparse: true }, // Google login

  // Planes y límites
  esPremium: { type: Boolean, default: false },
  fechaInicioPremium: { type: Date },
  fechaFinPremium: { type: Date },
  consultasRestantes: { type: Number, default: 5 },
  contratosRestantes: { type: Number, default: 3 },

  // Mensajes
  bienvenidaEnviada: { type: Boolean, default: false },

  // Recuperación de contraseña
  resetToken: { type: String },
  resetTokenExpire: { type: Date },

  // ✅ Verificación de cuenta por email
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpire: { type: Date }

}, {
  timestamps: true,
  collection: 'usuarios'
});

module.exports = mongoose.model('User', UserSchema, 'usuarios');
