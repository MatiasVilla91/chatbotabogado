const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fechaInicioPremium: { type: Date },
  fechaFinPremium: { type: Date },

  

  // ✅ Password solo requerido si NO es login por Google
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },

  googleId: { type: String, unique: true, sparse: true }, // Google login

  // Planes y límites
  esPremium: { type: Boolean, default: false },
  consultasRestantes: { type: Number, default: 5 },
  contratosRestantes: { type: Number, default: 3 }

}, {
  timestamps: true,
  collection: 'usuarios'
});

module.exports = mongoose.model('User', UserSchema, 'usuarios');
