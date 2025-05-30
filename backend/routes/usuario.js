// routes/usuario.js
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');
const User = require('../models/User');

// 🧠 Devuelve datos mínimos del plan del usuario (ideal para frontend)
router.get('/estado-plan', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('esPremium consultasRestantes contratosRestantes email');
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error("❌ Error en /estado-plan:", error);
    res.status(500).json({ mensaje: 'Error al obtener el estado del plan' });
  }
});

// 🧾 Devuelve todo el perfil del usuario (menos password)
router.get('/perfil', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error("❌ Error en /perfil:", error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario' });
  }
});

// 🔄 Devuelve los datos actuales del usuario logueado (para refrescar contexto)
router.get('/me', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error("❌ Error en /me:", error);
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
});

module.exports = router;
