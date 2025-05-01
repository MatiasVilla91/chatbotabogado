const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const passport = require('passport');
const rateLimit = require('express-rate-limit');


const { body, validationResult } = require('express-validator');


// ❗ Limitador de intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por IP
  message: "Demasiados intentos. Esperá un rato e intentá de nuevo.",
});

// ❗ Validador para registro (email válido y contraseña de mínimo 6 caracteres)
const validateRegister = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña demasiado corta'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Datos inválidos", errors: errors.array() });
    }
    next();
  }
];


  

// 🔐 Registro con email
router.post('/register', validateRegister, async (req, res) => {

  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    logger.info(`🆕 Nuevo registro: ${email}`);
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    logger.error(`❌ Registro fallido: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔐 Login con email
router.post('/login', loginLimiter, async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y contraseña requeridos" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    logger.info(`🔓 Inicio de sesión: ${email}`);
    res.json({ token, user: { name: user.name, email: user.email }, message: "Inicio de sesión exitoso" });
  } catch (error) {
    logger.error(`❌ Error al iniciar sesión: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🌐 INICIAR login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false, // 👈 sin sesiones
}));

// 🔁 CALLBACK de Google
router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login',
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
});

module.exports = router;
    