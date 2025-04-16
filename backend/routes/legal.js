// routes/legal.js
const express = require('express');
const { OpenAI } = require('openai');
const { checkAuth } = require('../middleware/auth');
const { verificarLimite } = require('../middleware/limites');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const Contrato = require('../models/Contrato');
const ChatLegal = require('../models/ChatLegal');
const promptLegal = require('../utils/promptLegal');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = express.Router();

// Validaciones y manejo de tokens
const { body, validationResult } = require('express-validator');
const { truncarHistorialPorTokens } = require('../utils/tokenUtils');


// 📌 Consulta legal con IA y guardado en MongoDB
router.post(
  '/consulta',
  checkAuth,
  verificarLimite('consulta'),
  body('pregunta').trim().notEmpty().withMessage("Debes proporcionar una pregunta válida."),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { pregunta } = req.body;

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

      const historialReducido = truncarHistorialPorTokens(historial, 8192 - 1000);

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: promptLegal },
          ...historialReducido,
          { role: "user", content: pregunta }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      const respuesta = response.choices?.[0]?.message?.content || "No se pudo generar una respuesta válida.";
      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await ChatLegal.create({
        usuario: req.user.id,
        mensajes: [
          { tipo: "sent", texto: pregunta, hora },
          { tipo: "received", texto: respuesta, hora }
        ]
      });

      res.json({ respuesta });
    } catch (error) {
      console.error("❌ Error en la consulta legal:", error);
      res.status(500).json({ message: "Error al consultar la IA", error: error.message });
    }
});


// 🧾 Subida de PDF y extracción de texto
router.post('/subir-pdf', checkAuth, upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se ha subido ningún archivo PDF" });

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    const textoExtraido = data.text.replace(/\n+/g, " ").trim();

    res.json({ message: "Archivo procesado exitosamente", contenido: textoExtraido });
  } catch (error) {
    console.error("❌ Error al procesar el PDF:", error);
    res.status(500).json({ message: "Error al procesar el PDF", error: error.message });
  }
});


// ❓ Preguntas sobre contenido de PDF
router.post(
  '/consulta-pdf',
  checkAuth,
  [
    body('pregunta').trim().notEmpty().withMessage("Debes proporcionar una pregunta."),
    body('contenidoPDF').trim().notEmpty().withMessage("Debes proporcionar el contenido del PDF.")
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { pregunta, contenidoPDF } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Eres un asistente legal experto en derecho Argentino que responde preguntas sobre documentos legales."
          },
          {
            role: "user",
            content: `Aquí tienes el contenido del documento:\n"${contenidoPDF}"\n\nPregunta: ${pregunta}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      const respuesta = response.choices?.[0]?.message?.content || "No se pudo generar una respuesta válida.";
      res.json({ respuesta });
    } catch (error) {
      console.error("❌ Error en la consulta a OpenAI:", error);
      res.status(500).json({ message: "Error al consultar la IA", error: error.message });
    }
});


// 📁 Historial de contratos
router.get('/historial', checkAuth, async (req, res) => {
  try {
    const contratos = await Contrato.find({ usuario: req.user.id })
      .sort({ createdAt: -1 })
      .select('mensaje_original contrato_generado ruta_pdf createdAt');

    res.json({ contratos });
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
});


// 📎 Descargar contrato desde Cloudinary
router.get('/descargar/:id', checkAuth, async (req, res) => {
  try {
    const contrato = await Contrato.findById(req.params.id);
    if (!contrato) return res.status(404).json({ message: "Contrato no encontrado." });
    if (contrato.usuario.toString() !== req.user.id) return res.status(403).json({ message: "No autorizado." });

    return res.redirect(contrato.ruta_pdf);
  } catch (error) {
    console.error("❌ Error al descargar:", error);
    res.status(500).json({ message: "Error al procesar descarga." });
  }
});

module.exports = router;
