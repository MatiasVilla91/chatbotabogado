const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Usuario = require("../models/User");
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


// ✅ Validaciones para cada endpoint
exports.validate = {
  register: [
    body("name").trim().notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Contraseña demasiado corta"),
  ],
  login: [
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Contraseña requerida"),
  ],
  forgotPassword: [
    body("email").isEmail().normalizeEmail().withMessage("Email inválido"),
  ],
  resetPassword: [
  body("password").isLength({ min: 6 }).withMessage("Contraseña demasiado corta"),
  ],
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const existingUser = await Usuario.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const nuevoUsuario = new Usuario({
    name,
    email,
    password: hashedPassword,
    esPremium: false,
    consultasRestantes: 5,
    contratosRestantes: 3,
    verifyToken,
    verifyTokenExpire: Date.now() + 1000 * 60 * 60, // ⏱️ 1 hora
    isVerified: false,
  });

  await nuevoUsuario.save();

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 12px;">
        <h2 style="color: #0a84ff;">¡Bienvenido a Dictum IA!</h2>
        <p>Para activar tu cuenta, hacé clic en el siguiente botón:</p>
        <a href="${verifyLink}" style="display: inline-block; background: #0a84ff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Verificar cuenta</a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no creaste esta cuenta, ignorá este mensaje.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    to: email,
    subject: "Verificá tu cuenta en Dictum IA",
    html,
  });

  res.json({ message: "Usuario creado. Te enviamos un email para verificar tu cuenta." });
};



exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await Usuario.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  if (!user.isVerified) {
  return res.status(401).json({ error: "Verificá tu email antes de iniciar sesión" });
}

  if (!user.password) {
    return res.status(401).json({ error: "Tu cuenta fue creada con Google. Iniciá sesión por Google." });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      esPremium: user.esPremium,
      consultasRestantes: user.consultasRestantes,
      contratosRestantes: user.contratosRestantes,
    },
  });
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email } = req.body;
  const user = await Usuario.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hora
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
        <h2 style="color: #0a84ff; text-align: center; margin-bottom: 30px;">Restablecé tu contraseña</h2>
        <p style="font-size: 16px; color: #333;">Recibimos una solicitud para restablecer tu contraseña en <strong>Dictum IA</strong>.</p>
        <p style="font-size: 16px; color: #333;">Si fuiste vos, hacé clic en el siguiente botón para establecer una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #0a84ff; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Restablecer contraseña
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">Si no solicitaste este cambio, podés ignorar este mensaje. Tu cuenta sigue segura.</p>
        <hr style="margin: 40px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Dictum IA – Tu asistente legal con inteligencia artificial
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    to: user.email,
    subject: "Restablecé tu contraseña",
    html,
  });

  res.json({ message: "Te enviamos un correo con instrucciones" });
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { token } = req.params;
const { password } = req.body;

  const user = await Usuario.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(401).json({ error: "Token inválido o expirado" });

user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Contraseña actualizada correctamente" });
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await Usuario.findOne({
      verifyToken: token,
      verifyTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Cuenta verificada correctamente" });

  } catch (error) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};


exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await Usuario.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  if (user.isVerified) return res.status(400).json({ error: "La cuenta ya está verificada" });
  if (!user.isVerified) {
  return res.status(401).json({ error: "Verificá tu email antes de iniciar sesión" });
}

  // Generar nuevo token
  const verifyToken = crypto.randomBytes(32).toString("hex");
  user.verifyToken = verifyToken;
  user.verifyTokenExpire = Date.now() + 3600000; // 1 hora
  await user.save();

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 12px;">
        <h2 style="color: #0a84ff;">Verificá tu cuenta</h2>
        <p>Hacé clic en el botón para activar tu cuenta en <strong>Dictum IA</strong>:</p>
        <a href="${verifyLink}" style="display: inline-block; background: #0a84ff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Verificar cuenta</a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no solicitaste esto, ignorá este mensaje.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    to: email,
    subject: "Reenvío de verificación de cuenta",
    html,
  });

  res.json({ message: "Te reenviamos el correo de verificación" });
};


