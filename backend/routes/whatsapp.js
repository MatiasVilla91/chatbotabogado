// routes/whatsapp.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { generarRespuestaLegal, generarContratoDesdeMensaje } = require('../services/openAIService');
const { generarPDFContrato } = require('../utils/pdfGenerator');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const ChatLegal = require('../models/ChatLegal');
const User = require('../models/User');
const promptLegal = require('../utils/promptLegal');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/webhook', async (req, res) => {
  try {
    const { Body, From } = req.body;
    console.log(`📩 Mensaje recibido de ${From}: ${Body}`);

    let respuesta = '';
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1️⃣ Cargar historial anterior del número de teléfono
    const historialDB = await ChatLegal.find({ telefono: From }).sort({ creado: 1 });
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

    // 2️⃣ Comando /ayuda
    if (Body.toLowerCase().includes("/ayuda")) {
      respuesta = `📌 Comandos disponibles:\n- contrato: genera un contrato personalizado\n- /ultimo: muestra tu último contrato\n- /contratos: muestra los últimos contratos\n- /plan: consulta tu estado de cuenta\n- /ayuda: muestra este menú`;
    }

    // 3️⃣ Comando /plan
    else if (Body.toLowerCase().includes("/plan")) {
      const user = await User.findOne({ telefono: From });
      if (!user) {
        respuesta = "No encontré tu cuenta registrada. Usás el bot como visitante.";
      } else if (user.esPremium) {
        respuesta = "🌟 Tu cuenta es Premium. Tenés acceso ilimitado a consultas y contratos.";
      } else {
        respuesta = `🧾 Tu plan actual es Gratuito.\nConsultas restantes: ${user.consultasRestantes}\nContratos restantes: ${user.contratosRestantes}`;
      }
    }

    // 4️⃣ Comando /ultimo
    else if (Body.toLowerCase().includes("/ultimo")) {
      const ultimo = historialDB.reverse().find(c => c.url);
      if (ultimo) {
        respuesta = `📄 Aquí tienes tu último contrato: ${ultimo.url}`;
      } else {
        respuesta = "❗ No encontré contratos previos. Intenta generar uno nuevo.";
      }
    }

    // 5️⃣ Comando /contratos
    else if (Body.toLowerCase().includes("/contratos")) {
      const ultimos = historialDB.filter(c => c.url).slice(-3);
      if (ultimos.length === 0) {
        respuesta = "❗ No encontré contratos anteriores.";
      } else {
        respuesta = ultimos.map((c, i) => `📄 Contrato ${i + 1}: ${c.url}`).join("\n");
      }
    }

    // 6️⃣ Generar contrato
    else if (Body.toLowerCase().includes("contrato")) {
      try {
        const contratoTexto = await generarContratoDesdeMensaje(Body);
        if (!contratoTexto) throw new Error("No se pudo generar el contrato.");

        const rutaPDF = await generarPDFContrato(contratoTexto, 'contrato');
        const urlPDF = await uploadToCloudinary(rutaPDF);

        await ChatLegal.create({
          telefono: From,
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

    // 7️⃣ Consulta legal normal con IA
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
        telefono: From,
        mensajes: [
          { tipo: "sent", texto: Body, hora },
          { tipo: "received", texto: respuesta, hora }
        ]
      });
    }

    // 8️⃣ Enviar la respuesta al usuario
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
