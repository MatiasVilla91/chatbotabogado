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
    // ✅ MOSTRAR EL TOKEN EN CONSOLA
    console.log(`✅ Login exitoso para ${email}`);
    //console.log(`🔐 TOKEN JWT: ${token}`);
    res.json({ token, user: { name: user.name, email: user.email }, message: "Inicio de sesión exitoso" });
  } catch (error) {
    logger.error(`❌ Error al iniciar sesión: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🌐 INICIAR login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/// 🔁 CALLBACK de Google (Mejorado y Seguro)
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true, // ✅ Habilitamos sesión
}), async (req, res) => {
  try {
    console.log("✅ Callback de Google - Usuario recibido:", req.user);
    
    const user = req.user;
    if (!user) {
      console.error("❌ Error: Usuario de Google no encontrado.");
      return res.status(500).send("Error al autenticar con Google");
    }

    // Generar el token JWT solo si el usuario existe
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    
    console.log("✅ Token generado:", token);

    // Verificar URL del frontend
    const frontendUrl = process.env.FRONTEND_URL;
    console.log("✅ URL de redirección:", frontendUrl);

    if (!frontendUrl) {
      console.error("❌ Error: FRONTEND_URL no está configurada.");
      return res.status(500).json({ message: "Error en la configuración del frontend" });
    }

    // ✅ Guardamos la sesión correctamente
    req.login(user, (err) => {
      if (err) {
        console.error("❌ Error al iniciar sesión en la sesión:", err);
        return res.status(500).send("Error al iniciar sesión en la sesión");
      }

      console.log("✅ Sesión de usuario guardada:", req.session);
      res.redirect(`${frontendUrl}/google-success?token=${token}`);
    });

  } catch (error) {
    console.error("❌ Error en el callback de Google:", error);
    res.status(500).send("Error interno del servidor");
  }
});


module.exports = router;
