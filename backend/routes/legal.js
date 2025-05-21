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
const promptEstudiante = require('../utils/promptLegalEstudiante');
const { cargarEmbeddings, buscarFragmentosRelevantes } = require("../services/legalRetriever");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = express.Router();
const logger = require('../utils/logger'); // ✅ al principio, limpio y global

//cargarEmbeddings(); // Cargar embeddings al iniciar

// Validaciones y manejo de tokens
const { body, validationResult } = require('express-validator');
const { truncarHistorialPorTokens } = require('../utils/tokenUtils');


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
      const { pregunta, modoLegal } = req.body;
      const promptBase = modoLegal === 'estudiante' ? promptEstudiante : promptLegal;

      // 🔍 Fragmentos legales relevantes
      const fragmentos = await buscarFragmentosRelevantes(pregunta, 5); // podés reducir a 3 si querés
      const fragmentosLimitados = fragmentos.map(f => f.slice(0, 1000)); // 🔪 recorte seguro

      const fragmentosComoMensajes = fragmentosLimitados.map(frag => ({
        role: "system",
        content: `📚 Fragmento legal:\n${frag}`
      }));

      // 🧠 Historial
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

      const historialReducido = truncarHistorialPorTokens(historial, 4000); // 🔧 conservador

      // 🧠 Construcción del mensaje
      const messages = [
        { role: "system", content: promptBase },
        ...fragmentosComoMensajes,
        ...historialReducido,
        { role: "user", content: pregunta }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
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

      logger.info(`📚 Consulta legal registrada para usuario ${req.user.id}`);
      res.json({ respuesta });

    } catch (error) {
      console.error("❌ Error en la consulta legal:", error);
      res.status(500).json({ message: "Error al consultar la IA", error: error.message });
    }
  }
);




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
            content: promptLegal
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
      logger.info(`📑 Consulta sobre PDF respondida para usuario ${req.user.id}`);


      res.json({ respuesta });
    } catch (error) {
      console.error("❌ Error en la consulta a OpenAI:", error);
      res.status(500).json({ message: "Error al consultar la IA", error: error.message });
    }
});


// ✅ TEST EMBEDDINGS
router.get('/test-embedding', async (req, res) => {
  try {
    const pregunta = req.query.q || "¿Qué es una declaratoria de herederos?";
    const fragmentos = await buscarFragmentosRelevantes(pregunta);

    res.json({
      pregunta,
      fragmentos
    });
  } catch (error) {
    console.error("❌ Error al testear embeddings:", error);
    res.status(500).json({ error: "Error interno al testear embeddings." });
  }
});

// ✅ Ruta para obtener el historial de conversaciones
router.get('/conversaciones', checkAuth, async (req, res) => {
  try {
    const historial = await ChatLegal.find({ usuario: req.user.id })
      .sort({ creado: -1 })
      .select('mensajes creado');

    const resumen = historial.map(chat => {
      const titulo = chat.mensajes.find(m => m.tipo === "sent")?.texto?.slice(0, 40) || "Sin título";
      return {
        _id: chat._id,
        titulo,
        creado: chat.creado,
      };
    });

    res.json({ conversaciones: resumen });
  } catch (error) {
    console.error("❌ Error al obtener conversaciones:", error);
    res.status(500).json({ message: "Error al obtener historial de chats" });
  }
});

// ✅ Ruta para obtener una conversación específica por ID
router.get('/conversacion/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await ChatLegal.findById(id);

    if (!chat) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    if (chat.usuario.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado para ver esta conversación." });
    }

    res.json({ mensajes: chat.mensajes });
  } catch (error) {
    console.error("❌ Error al obtener la conversación:", error);
    res.status(500).json({ message: "Error al obtener la conversación." });
  }
});





// 📎 Descargar contrato desde Cloudinary
router.get('/descargar/:id', checkAuth, async (req, res) => {
  try {
    const contrato = await Contrato.findById(req.params.id);
    if (!contrato) return res.status(404).json({ message: "Contrato no encontrado." });
    if (contrato.usuario.toString() !== req.user.id) return res.status(403).json({ message: "No autorizado." });

  logger.info(`📥 Descarga de contrato: ${contrato._id} por usuario ${req.user.id}`);


    return res.redirect(contrato.ruta_pdf);
  } catch (error) {
    console.error("❌ Error al descargar:", error);
    res.status(500).json({ message: "Error al procesar descarga." });
  }
});




// ✅ Ruta para eliminar una conversación específica del historial
router.delete('/conversaciones/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos que la conversación exista y pertenezca al usuario autenticado
    const chat = await ChatLegal.findById(id);
    if (!chat) {
      return res.status(404).json({ message: "Conversación no encontrada." });
    }

    if (chat.usuario.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado para eliminar esta conversación." });
    }

    // Eliminamos la conversación
    await ChatLegal.findByIdAndDelete(id);

    res.status(200).json({ message: "Conversación eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar la conversación:", error);
    res.status(500).json({ message: "Error al eliminar la conversación" });
  }
});







module.exports = router;