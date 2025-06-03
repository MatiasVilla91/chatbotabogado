const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Usuario = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await Usuario.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const nuevoUsuario = new Usuario({
    name,
    email,
    password: hashedPassword,
    esPremium: false,
    consultasRestantes: 5,
    contratosRestantes: 3,
  });

  await nuevoUsuario.save();

  const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: {
      id: nuevoUsuario._id,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
      esPremium: nuevoUsuario.esPremium,
      consultasRestantes: nuevoUsuario.consultasRestantes,
      contratosRestantes: nuevoUsuario.contratosRestantes,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Usuario.findOne({ email });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  if (!user.password) return res.status(401).json({ error: "Tu cuenta fue creada con Google. Iniciá sesión por Google." });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

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
  const { token } = req.params;
  const { nueva } = req.body;

  const user = await Usuario.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Token inválido o expirado" });

  user.password = await bcrypt.hash(nueva, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Contraseña actualizada correctamente" });
};
