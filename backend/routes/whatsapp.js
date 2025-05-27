const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { generarContratoDesdeMensaje } = require('../services/openAIService');
const { generarPDFContrato } = require('../utils/pdfGenerator');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const ChatLegal = require('../models/ChatLegal');
const Contrato = require('../models/Contrato'); // 👈 nuevo
const User = require('../models/User');
const promptLegal = require('../utils/promptLegal');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post(
  '/webhook',
  [
    body('Body').trim().notEmpty().withMessage("El mensaje recibido no puede estar vacío."),
    body('From').trim().notEmpty().withMessage("El número de remitente es obligatorio.")
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      logger.warn(`⚠️ Error de validación: ${JSON.stringify(errores.array())}`);
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const { Body, From } = req.body;
      logger.info(`📩 Mensaje recibido de ${From}: ${Body}`);

      let respuesta = '';
      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Registro automático si no existe usuario
      let user = await User.findOne({ telefono: From });
      if (!user) {
  user = await User.create({
    name: 'Invitado',
    email: `auto+${Date.now()}@dictum.com`,
    telefono: From,
    password: 'temporal123',
    esPremium: false,
    consultasRestantes: 5,
    contratosRestantes: 2
  });
  logger.info(`👤 Usuario registrado automáticamente: ${user.telefono}`);

  // Mensaje de bienvenida
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: From,
    body: `👋 ¡Bienvenido a *Dictum IA*! Soy tu asistente legal. Podés escribirme lo que necesites o usar comandos como:\n\n📄 /contrato\n🔎 /consulta\n💎 /premium\n❓ /ayuda\n\n🧠 Estoy listo para ayudarte con cualquier tema legal relacionado con Argentina.`
  });
}


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

      // Comandos
      const bodyLower = Body.toLowerCase();

      if (bodyLower.includes("/ayuda")) {
  respuesta =
    `📚 *Menú de ayuda de Dictum IA*\n\n` +
    `🧠 *Consultas legales*\n` +
    `Escribí tu pregunta directamente o usá /consulta\n\n` +
    `📄 *Contratos*\n` +
    `/contrato → Genera un contrato legal personalizado\n` +
    `/miscontratos → Ver últimos contratos generados\n\n` +
    `🗂️ *Historial*\n` +
    `/historial → Ver tus consultas anteriores\n\n` +
    `💎 *Cuenta y suscripción*\n` +
    `/plan → Ver tu plan actual\n` +
    `/premium → Pasar a Premium y desbloquear todo\n\n` +
    `ℹ️ /ayuda → Mostrar este menú`;
}

else if (bodyLower.includes("/historial")) {
  const chats = await ChatLegal.find({ telefono: From }).sort({ creado: -1 }).limit(5);

  if (!chats.length) {
    respuesta = "🗂️ No encontré consultas anteriores tuyas. ¡Escribime cualquier duda legal que tengas!";
  } else {
    const resumen = chats.map((c, i) => {
      const pregunta = c.mensajes.find(m => m.tipo === "sent")?.texto?.slice(0, 60) || "Consulta sin título";
      return `🧠 ${i + 1}) ${pregunta}`;
    }).join("\n");

    respuesta = `📚 *Últimas consultas realizadas:*\n\n${resumen}\n\nEscribí nuevamente cualquiera para retomarla.`;
  }
}



      else if (bodyLower.includes("/plan")) {
        respuesta = user.esPremium
          ? "🌟 Tu cuenta es Premium. Tenés acceso ilimitado a consultas y contratos."
          : `🧾 Tu plan actual es Gratuito.\nConsultas restantes: ${user.consultasRestantes}\nContratos restantes: ${user.contratosRestantes}`;
      }

      else if (bodyLower.includes("/premium")) {
  respuesta =
    `💎 *Dictum IA Premium*\n\n` +
    `✔️ Consultas legales ilimitadas\n` +
    `✔️ Generación de contratos sin límites\n` +
    `✔️ Soporte prioritario\n\n` +
    `💳 Activá tu cuenta Premium aquí:\n${process.env.LINK_PREMIUM || 'https://tu-link-de-pago.com'}`;
}


      else if (bodyLower.includes("/ultimo")) {
        const ultimo = await Contrato.find({ usuario: user._id }).sort({ createdAt: -1 }).limit(1);
        if (ultimo.length > 0) {
          respuesta = `📄 Aquí tienes tu último contrato: ${ultimo[0].ruta_pdf}`;
        } else {
          respuesta = "❗ No encontré contratos previos. Intenta generar uno nuevo.";
        }
      }

      else if (bodyLower.includes("/miscontratos") || bodyLower.includes("/contratos")) {
  const ultimos = await Contrato.find({ usuario: user._id }).sort({ createdAt: -1 }).limit(3);
  if (ultimos.length === 0) {
    respuesta = "📂 Aún no generaste ningún contrato legal. Escribí 'Quiero un contrato de...' para crear el primero.";
  } else {
    respuesta = `📄 *Tus últimos contratos generados:*\n\n` +
      ultimos.map((c, i) => `📑 Contrato ${i + 1}: ${c.ruta_pdf}`).join("\n");
  }
}


      // 🚨 CONTRATO
      else if (bodyLower.includes("contrato")) {
        if (!user.esPremium && user.contratosRestantes <= 0) {
          respuesta = "🚫 Tu plan gratuito ya no tiene contratos disponibles. Escribí /premium para seguir usando el asistente.";
        } else {
          try {
            const contratoTexto = await generarContratoDesdeMensaje(Body);
            if (!contratoTexto) throw new Error("No se pudo generar el contrato.");

            const rutaPDF = await generarPDFContrato(contratoTexto, 'contrato');
            const urlPDF = await uploadToCloudinary(rutaPDF);

            await Contrato.create({
              usuario: user._id,
              tipo: 'whatsapp',
              mensaje_original: Body,
              contrato_generado: contratoTexto,
              ruta_pdf: urlPDF
            });

            if (!user.esPremium) {
              user.contratosRestantes = Math.max(0, user.contratosRestantes - 1);
              await user.save();
            }

            respuesta = `✅ ¡Tu contrato está listo! Puedes descargarlo aquí: ${urlPDF}`;
          } catch (error) {
            logger.error(`❌ Error al generar contrato: ${error.message}`);
            respuesta = "❗ Hubo un problema al generar el contrato. Intenta nuevamente.";
          }
        }
      }

      // 🔎 CONSULTA IA
      else {
        if (!user.esPremium && user.consultasRestantes <= 0) {
          respuesta = "🛑 Tu plan gratuito ha alcanzado el límite de consultas. Escribí /premium para continuar.";
        } else {
          try {
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

            if (!user.esPremium) {
              user.consultasRestantes = Math.max(0, user.consultasRestantes - 1);
              await user.save();
            }
          } catch (error) {
            logger.error(`❌ Error al consultar OpenAI: ${error.message}`);
            respuesta = "❗ Hubo un error al procesar tu consulta legal. Intentá nuevamente más tarde.";
          }
        }
      }

      //dividir mensajes largos
      const partes = [];
let texto = respuesta;

while (texto.length > 0) {
  partes.push(texto.slice(0, 1500));
  texto = texto.slice(1500);
}

for (let i = 0; i < partes.length; i++) {
  const parte = partes.length > 1 ? `(${i + 1}/${partes.length}) ${partes[i]}` : partes[i];

  await client.messages.create({
    body: parte,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: From
  }).then(msg => {
    console.log("📤 Twilio SID:", msg.sid);
  }).catch(err => {
    console.error("❌ ERROR AL ENVIAR POR TWILIO:", err?.message || err);
  });

  await new Promise(r => setTimeout(r, 1000)); // Espera 1 segundo entre partes
}

logger.info(`✅ Mensaje enviado a ${From}: ${respuesta}`);
res.status(200).send('Mensaje procesado');




      // 📨 Enviar respuesta por WhatsApp 
{/*await client.messages.create({
  body: respuesta,
  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
  to: From
})
.then(msg => {
  console.log("📤 Twilio SID:", msg.sid);
})
.catch(err => {
  console.error("❌ ERROR AL ENVIAR POR TWILIO:", err?.message || err);
});*/}



      logger.info(`✅ Mensaje enviado a ${From}: ${respuesta}`);
      res.status(200).send('Mensaje procesado');

    } catch (error) {
      logger.error(`❌ Error en el webhook: ${error.message}`);
      res.status(500).send('Error interno');
    }
  }
);

module.exports = router;
