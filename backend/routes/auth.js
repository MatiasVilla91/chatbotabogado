const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Modelo de usuario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de campos vacíos
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ Usuario no encontrado: ${email}`);
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Contraseña incorrecta");
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Generar el token JWT
        if (!process.env.JWT_SECRET) {
            console.error("❌ Clave JWT_SECRET no definida en el entorno");
            return res.status(500).json({ message: "Configuración del servidor incorrecta" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        console.log(`✅ Usuario autenticado: ${email}`);
        res.json({ token, message: "Inicio de sesión exitoso" });

    } catch (error) {
        console.error("❌ Error en el servidor al iniciar sesión:", error.message);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});


module.exports = router;