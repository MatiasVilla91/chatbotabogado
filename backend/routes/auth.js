const express = require('express');
const router = express.Router();
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken'); // ⬅️ FALTA ESTA LÍNEA

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  validate,
  verifyEmail,
  resendVerificationEmail
} = require("../controllers/authController");

// 🔒 Limitador de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Demasiados intentos. Esperá un rato e intentá de nuevo.",
});

// 📝 Registro con validación
router.post('/register', validate.register, register);

// 🔐 Login con validación
router.post('/login', loginLimiter, validate.login, login);

// 🔑 Recuperar contraseña
router.post('/forgot-password', validate.forgotPassword, forgotPassword);
router.post('/reset-password/:token', validate.resetPassword, resetPassword);
router.post("/resend-verification-email", resendVerificationEmail);
// Verificación de token para restablecer contraseña
router.get("/reset-token/:token", async (req, res) => {
  const { token } = req.params;
  const user = await require('../models/User').findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ error: "Token inválido o expirado" });
  res.json({ email: user.email });
});

router.get("/verify-email/:token", verifyEmail);

// 🌐 Login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 🔁 Callback de Google
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
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

  router.get("/verify-email/:token", verifyEmail);


    req.login(user, (err) => {
      if (err) return res.status(500).send("Error al iniciar sesión");
      const redirect = `${frontendUrl}/google-success?token=${token}&user=${userSerialized}`;
      res.redirect(redirect);
    });
  } catch (error) {
    console.error("❌ Error en callback Google:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
