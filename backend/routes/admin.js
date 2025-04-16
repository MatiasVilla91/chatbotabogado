const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');

const User = require('../models/User');
const ChatLegal = require('../models/ChatLegal');
const Contrato = require('../models/Contrato');

// 🔒 Middleware para permitir solo al administrador (vos)
const soloAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.email !== 'mati') {
    return res.status(403).json({ message: 'Acceso denegado: solo para administradores.' });
  }
  next();
};

// 🧑‍💻 Obtener todos los usuarios
router.get('/usuarios', checkAuth, soloAdmin, async (req, res) => {
  try {
    const usuarios = await User.find().select('name email esPremium consultasRestantes contratosRestantes createdAt');
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});

// 📜 Consultas de un usuario
router.get('/consultas/:userId', checkAuth, soloAdmin, async (req, res) => {
  try {
    const chats = await ChatLegal.find({ usuario: req.params.userId });
    res.json(chats);
  } catch (error) {
    console.error('❌ Error al obtener consultas:', error);
    res.status(500).json({ message: 'Error al obtener consultas.' });
  }
});

// 📄 Contratos de un usuario
router.get('/contratos/:userId', checkAuth, soloAdmin, async (req, res) => {
  try {
    const contratos = await Contrato.find({ usuario: req.params.userId });
    res.json(contratos);
  } catch (error) {
    console.error('❌ Error al obtener contratos:', error);
    res.status(500).json({ message: 'Error al obtener contratos.' });
  }
});




module.exports = router;
