const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { generarRespuestaConContexto } = require('../services/openAIService');
const ChatLegal = require('../models/ChatLegal');

const router = express.Router();

router.post('/consulta', checkAuth, async (req, res) => {
    try {
        const { pregunta } = req.body;
        if (!pregunta) {
            return res.status(400).json({ message: "Debes proporcionar una pregunta válida." });
        }

        const chatsAnteriores = await ChatLegal.find({ usuario: req.user.id }).sort({ creado: 1 });
        let historial = [];
        chatsAnteriores.forEach(chat => {
            chat.mensajes.forEach(m => {
                historial.push({
                    role: m.tipo === 'sent' ? 'user' : 'assistant',
                    content: m.texto
                });
            });
        });
        historial = historial.slice(-10);

        const respuesta = await generarRespuestaConContexto(pregunta, historial);

        res.json({ respuesta });
    } catch (error) {
        console.error("❌ Error en la consulta legal:", error);
        res.status(500).json({ message: "Error en la consulta." });
    }
});

module.exports = router;
