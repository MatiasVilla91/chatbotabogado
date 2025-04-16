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
        respuesta = `📌 Comandos disponibles:\n- contrato: genera un contrato personalizado\n- /ultimo: muestra tu último contrato\n- /contratos: muestra los últimos contratos\n- /plan: consulta tu estado de cuenta\n- /premium: actualizar tu cuenta\n- /ayuda: muestra este menú`;
      }

      else if (bodyLower.includes("/plan")) {
        respuesta = user.esPremium
          ? "🌟 Tu cuenta es Premium. Tenés acceso ilimitado a consultas y contratos."
          : `🧾 Tu plan actual es Gratuito.\nConsultas restantes: ${user.consultasRestantes}\nContratos restantes: ${user.contratosRestantes}`;
      }

      else if (bodyLower.includes("/premium")) {
        respuesta = `✨ Para desbloquear uso ilimitado del asistente legal, actualizá a Premium aquí:\n${process.env.LINK_PREMIUM || 'https://tu-link-de-pago.com'}`;
      }

      else if (bodyLower.includes("/ultimo")) {
        const ultimo = await Contrato.find({ usuario: user._id }).sort({ createdAt: -1 }).limit(1);
        if (ultimo.length > 0) {
          respuesta = `📄 Aquí tienes tu último contrato: ${ultimo[0].ruta_pdf}`;
        } else {
          respuesta = "❗ No encontré contratos previos. Intenta generar uno nuevo.";
        }
      }

      else if (bodyLower.includes("/contratos")) {
        const ultimos = await Contrato.find({ usuario: user._id }).sort({ createdAt: -1 }).limit(3);
        if (ultimos.length === 0) {
          respuesta = "❗ No encontré contratos anteriores.";
        } else {
          respuesta = ultimos.map((c, i) => `📄 Contrato ${i + 1}: ${c.ruta_pdf}`).join("\n");
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

      // 📨 Enviar respuesta por WhatsApp
      await client.messages.create({
        body: respuesta,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: From
      });

      logger.info(`✅ Mensaje enviado a ${From}: ${respuesta}`);
      res.status(200).send('Mensaje procesado');

    } catch (error) {
      logger.error(`❌ Error en el webhook: ${error.message}`);
      res.status(500).send('Error interno');
    }
  }
);

module.exports = router;
