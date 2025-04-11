// routes/whatsapp.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { generarRespuestaLegal, generarContratoDesdeMensaje } = require('../services/openAIService');
const { generarPDFContrato } = require('../utils/pdfGenerator');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const ChatLegal = require('../models/ChatLegal');
const promptLegal = require('../utils/promptLegal');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/webhook', async (req, res) => {
  try {
    const { Body, From } = req.body;
    console.log(`📩 Mensaje recibido de ${From}: ${Body}`);

    let respuesta = '';

    // 1️⃣ Recuperar historial anterior
    const historialDB = await ChatLegal.find({ usuario: From }).sort({ creado: 1 });
    let historial = [];
    historialDB.forEach(chat => {
      chat.mensajes.forEach(m => {
        historial.push({
          role: m.tipo === 'sent' ? 'user' : 'assistant',
          content: m.texto
        });
      });
    });
    historial = historial.slice(-10);

    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 2️⃣ Comando especial: /ultimo
    if (Body.toLowerCase().includes("/ultimo")) {
      const ultimo = historialDB.reverse().find(c => c.url);
      if (ultimo) {
        respuesta = `📄 Aquí tienes tu último contrato: ${ultimo.url}`;
      } else {
        respuesta = "❗ No encontré contratos previos. Intenta generar uno nuevo.";
      }
    }

    // 3️⃣ Generar contrato si detecta palabra "contrato"
    else if (Body.toLowerCase().includes("contrato")) {
      try {
        const contratoTexto = await generarContratoDesdeMensaje(Body);
        if (!contratoTexto) throw new Error("No se pudo generar el contrato.");

        const rutaPDF = await generarPDFContrato(contratoTexto, 'contrato');
        const urlPDF = await uploadToCloudinary(rutaPDF);

        await ChatLegal.create({
          usuario: From,
          mensajes: [
            { tipo: "sent", texto: Body, hora },
            { tipo: "received", texto: `✅ ¡Tu contrato está listo! Puedes descargarlo aquí: ${urlPDF}`, hora }
          ],
          url: urlPDF
        });

        respuesta = `✅ ¡Tu contrato está listo! Puedes descargarlo aquí: ${urlPDF}`;
      } catch (error) {
        console.error("❌ Error al generar contrato:", error);
        respuesta = "❗ Hubo un problema al generar el contrato. Intenta nuevamente.";
      }
    }

    // 4️⃣ Consulta legal normal con contexto y prompt especializado
    else {
      const openai = require("openai");
      const ia = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await ia.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: promptLegal },
          ...historial,
          { role: "user", content: Body }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      respuesta = completion.choices?.[0]?.message?.content || "❗ No se pudo generar una respuesta válida.";

      await ChatLegal.create({
        usuario: From,
        mensajes: [
          { tipo: "sent", texto: Body, hora },
          { tipo: "received", texto: respuesta, hora }
        ]
      });
    }

    // 5️⃣ Enviar la respuesta por WhatsApp
    await client.messages.create({
      body: respuesta,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: From
    });

    console.log(`✅ Mensaje enviado a ${From}: ${respuesta}`);
    res.status(200).send('Mensaje procesado');
  } catch (error) {
    console.error('❌ Error en el webhook:', error);
    res.status(500).send('Error interno');
  }
});

module.exports = router;
