const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { forgotPassword, resetPassword } = require("../controllers/authController");

// 🔒 Limitador de intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Demasiados intentos. Esperá un rato e intentá de nuevo.",
});

// ✅ Validación de registro
const validateRegister = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña muy corta'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Datos inválidos", errors: errors.array() });
    }
    next();
  }
];

// 📝 Registro
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

// 🔐 Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Faltan datos" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    logger.info(`🔓 Login: ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        esPremium: user.esPremium,
        consultasRestantes: user.consultasRestantes,
        contratosRestantes: user.contratosRestantes
      },
      message: "Inicio de sesión exitoso"
    });
  } catch (error) {
    logger.error(`❌ Error en login: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔑 Recuperar contraseña
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/reset-token/:token", async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ error: "Token inválido o expirado" });
  res.json({ email: user.email });
});

// 🌐 Login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 🔁 Callback de Google
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false, // usamos solo JWT
}), async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(500).send("Error al autenticar con Google");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      return res.status(500).json({ message: "Falta FRONTEND_URL en .env" });
    }

    const userSerialized = encodeURIComponent(JSON.stringify({
      _id: user._id,
      email: user.email,
      name: user.name,
    }));

    req.login(user, (err) => {
      if (err) return res.status(500).send("Error al iniciar sesión");
      const redirect = `${frontendUrl}/google-success?token=${token}&user=${userSerialized}`;
      console.log("🔁 Redireccionando a:", redirect);
      res.redirect(redirect);
    });
  } catch (error) {
    console.error("❌ Error en callback Google:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
