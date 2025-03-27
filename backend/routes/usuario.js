// routes/usuario.js
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');
const User = require('../models/User');

router.get('/estado-plan', checkAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('esPremium consultasRestantes contratosRestantes email');
  res.json(user);
});

module.exports = router;
