// routes/usuario.js
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');
const User = require('../models/User');

router.get('/estado-plan', checkAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('esPremium consultasRestantes contratosRestantes email');
  res.json(user);
});

router.get('/perfil', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario' });
  }
});


module.exports = router;
