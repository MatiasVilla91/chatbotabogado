const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Modelo de usuario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // al inicio del archivo si no está


// Ruta para registro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();
        logger.info(`🆕 Nuevo registro: ${email}`);


        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`❌ Intento de login con email inexistente: ${email}`);
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`❌ Contraseña incorrecta para: ${email}`);
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        if (!process.env.JWT_SECRET) {
            logger.error("❌ JWT_SECRET no definida en el entorno");
            return res.status(500).json({ message: "Configuración del servidor incorrecta" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        logger.info(`🔓 Inicio de sesión: ${email}`);
        res.json({ token,user: {
            name: user.name,
            email: user.email,
          },message: "Inicio de sesión exitoso" });

    } catch (error) {
        logger.error(`❌ Error al iniciar sesión: ${error.message}`);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});

module.exports = router;