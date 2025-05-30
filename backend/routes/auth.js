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
  max: 10,
  message: "Demasiados intentos. Esperá un rato e intentá de nuevo.",
});

// ❗ Validador para registro
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
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      message: "Inicio de sesión exitoso"
    });
  } catch (error) {
    logger.error(`❌ Error al iniciar sesión: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🌐 INICIAR login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 🔁 CALLBACK de Google (corregido y completo)
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true,
}), async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(500).send("Error al autenticar con Google");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      return res.status(500).json({ message: "Error en la configuración del frontend" });
    }

    const userSerialized = encodeURIComponent(JSON.stringify({
      _id: user._id,
      email: user.email,
      name: user.name,
    }));

    req.login(user, (err) => {
      if (err) {
        return res.status(500).send("Error al iniciar sesión");
      }

      const redireccion = `${frontendUrl}/google-success?token=${token}&user=${userSerialized}`;
      console.log("🔁 Redireccionando a:", redireccion);
      res.redirect(redireccion);
    });
  } catch (error) {
    console.error("❌ Error en callback Google:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
