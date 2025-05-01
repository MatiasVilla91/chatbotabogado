const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

// Middleware: Limita intentos en /login y /register
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos
  message: "Demasiados intentos. Espera unos minutos e intentá de nuevo.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware: Valida email y password
const validateAuth = [
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

// Seguridad extra con Helmet (cabeceras HTTP)
const secureHeaders = helmet();

module.exports = {
  loginLimiter,
  validateAuth,
  secureHeaders
};
