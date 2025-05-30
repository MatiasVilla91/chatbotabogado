const TelegramBot = require('node-telegram-bot-api');
const { generarContratoDesdeMensaje } = require('../services/openAIService');
const { generarPDFContrato } = require('../utils/pdfGenerator');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const ChatLegal = require('../models/ChatLegal');
const Contrato = require('../models/Contrato');
const User = require('../models/User');
const promptLegal = require('../utils/promptLegal');
const logger = require('../utils/logger');
const openai = require("openai");
const RegistroConsulta = require('../models/RegistroConsulta');


const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

let bot;

if (process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(TELEGRAM_TOKEN);
  bot.setWebHook(`${process.env.BASE_URL}/bot${TELEGRAM_TOKEN}`);
  logger.info("📡 Bot de Telegram usando Webhook");
} else {
  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
  logger.info("🤖 Bot de Telegram usando Polling (modo desarrollo)");
}

//seguridad
const rateLimit = new Map();
const actividadUsuarios = new Map(); // telegramId => [timestamps]
const USUARIO_SPAM_LIMITE = 10; // máximo 10 mensajes por minuto
const BLOQUEO_TIEMPO = 60 * 1000; // 1 minuto
const bloqueados = new Map(); // telegramId => timestamp hasta el que está bloqueado


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  console.log("🧑‍💼 Nuevo mensaje de:", msg.from.first_name, "chatId:", chatId);
  const ahora = Date.now();

// Si está bloqueado
if (bloqueados.has(chatId) && bloqueados.get(chatId) > ahora) {
  return bot.sendMessage(chatId, "🚫 Estás temporalmente bloqueado por actividad sospechosa.");
}

// Registrar actividad
const actividad = actividadUsuarios.get(chatId) || [];
const actividadFiltrada = actividad.filter(t => ahora - t < 60 * 1000);
actividadFiltrada.push(ahora);
actividadUsuarios.set(chatId, actividadFiltrada);

// Si superó el límite, bloquear
if (actividadFiltrada.length > USUARIO_SPAM_LIMITE) {
  bloqueados.set(chatId, ahora + BLOQUEO_TIEMPO);
  return bot.sendMessage(chatId, "🚨 Has sido bloqueado temporalmente por enviar demasiados mensajes.");
}


  const texto = msg.text?.trim();
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const telefono = (msg.contact && msg.contact.user_id === msg.from.id)
  ? msg.contact.phone_number
  : null;


  //seguridad
  

  const now = Date.now();
  if (rateLimit.has(chatId) && now - rateLimit.get(chatId) < 2000) {
  return bot.sendMessage(chatId, "⚠️ Esperá un momento antes de enviar otra consulta.");
  }
  rateLimit.set(chatId, now);


 
  

//fin seguridad


  if (!texto) return;
  if (texto.length > 1000) return bot.sendMessage(chatId, "⚠️ El mensaje es demasiado largo.");
  if (/https?:\/\//i.test(texto)) return bot.sendMessage(chatId, "🚫 No se permiten enlaces.");

  try {
    
  let user = await User.findOne({ telegramId: chatId });

if (!user) {
  user = await User.create({
    name: msg.from.first_name || 'Invitado',
    email: `tg+${Date.now()}@dictum.com`,
    telegramId: chatId,
    telefono: telefono,
    password: require('crypto').randomBytes(16).toString('hex'),
    esPremium: false,
    consultasRestantes: 5,
    contratosRestantes: 2,
    bienvenidaEnviada: false
  });
}

// ✅ Enviar bienvenida solo si no fue enviada antes
if (!user.bienvenidaEnviada) {
  await bot.sendMessage(chatId, `👋 ¡Bienvenido a *Dictum IA*! Soy tu asistente legal. Podés escribirme cualquier duda o usar comandos como:\n\n/contrato\n/historial\n/miscontratos\n/premium\n/plan`);
  user.bienvenidaEnviada = true;
  await user.save();
}
  
  
  

    const textoLower = texto.toLowerCase();
    let respuesta = "";

    if (textoLower === '/plan') {
      respuesta = user.esPremium
        ? "🌟 Sos usuario Premium. Consultas y contratos ilimitados."
        : `🧾 Plan Gratuito:\nConsultas restantes: ${user.consultasRestantes}\nContratos restantes: ${user.contratosRestantes}`;
    }

    else if (textoLower === '/premium') {
      respuesta = `💎 *Dictum IA Premium*\n✔️ Consultas ilimitadas\n✔️ Contratos sin límites\n✔️ Soporte prioritario\n\n💳 Activá tu cuenta en:\n${process.env.LINK_PREMIUM || 'https://tu-link-de-pago.com'}`;
    }

    else if (textoLower === '/historial') {
      const chats = await ChatLegal.find({ telegramId: chatId }).sort({ creado: -1 }).limit(5);
      if (!chats.length) {
        respuesta = "🗂️ No encontré consultas anteriores tuyas.";
      } else {
        const resumen = chats.map((c, i) => {
          const pregunta = c.mensajes.find(m => m.tipo === "sent")?.texto?.slice(0, 60) || "Consulta sin título";
          return `🧠 ${i + 1}) ${pregunta}`;
        }).join("\n");
        respuesta = `📚 Últimas consultas:\n\n${resumen}`;
      }
    }

    else if (textoLower === '/miscontratos') {
      const ultimos = await Contrato.find({ usuario: user._id }).sort({ createdAt: -1 }).limit(3);
      if (!ultimos.length) {
        respuesta = "📂 Aún no generaste contratos.";
      } else {
        respuesta = ultimos.map((c, i) => `📄 Contrato ${i + 1}: ${c.ruta_pdf}`).join("\n");
      }
    }

    else if (textoLower.includes("contrato")) {
      if (!user.esPremium && user.contratosRestantes <= 0) {
        respuesta = "🚫 Tu plan gratuito no permite más contratos. Usá /premium para desbloquear acceso ilimitado.";
      } else {
        const contratoTexto = await generarContratoDesdeMensaje(texto);
        const rutaPDF = await generarPDFContrato(contratoTexto, 'contrato');
        const urlPDF = await uploadToCloudinary(rutaPDF);

        await Contrato.create({
          usuario: user._id,
          tipo: 'telegram',
          mensaje_original: texto,
          contrato_generado: contratoTexto,
          ruta_pdf: urlPDF
        });

        if (!user.esPremium) {
          user.contratosRestantes = Math.max(0, user.contratosRestantes - 1);
          await user.save();
        }

        respuesta = `✅ ¡Contrato generado! Descargalo aquí:\n${urlPDF}`;
      }
    }

    else {
      if (!user.esPremium && user.consultasRestantes <= 0) {
        respuesta = "🛑 Alcanzaste el límite de consultas. Usá /premium para seguir usando Dictum IA.";
      } else {
        const ia = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const historialDB = await ChatLegal.find({ telegramId: chatId }).sort({ creado: 1 });
        let historial = [];
        historialDB.forEach(chat => {
          chat.mensajes.forEach(m => {
            historial.push({
              role: m.tipo === 'sent' ? 'user' : 'assistant',
              content: m.texto
            });
          });
        });

        const completion = await ia.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: promptLegal },
            ...historial,
            { role: "user", content: texto }
          ],
          temperature: 0.2,
          max_tokens: 1000
        });

        respuesta = completion.choices?.[0]?.message?.content || "❗ No pude generar una respuesta válida.";

        await ChatLegal.create({
          telegramId: chatId,
          mensajes: [
            { tipo: "sent", texto: texto, hora },
            { tipo: "received", texto: respuesta, hora }
          ]
        });

      await RegistroConsulta.create({
      telegramId: chatId,
      userId: user._id,
      nombre: msg.from.first_name || 'Invitado',
      username: msg.from.username || null,
      telefono: telefono,
      texto: texto,
      hora: hora
});


        if (!user.esPremium) {
          await bot.sendMessage(chatId, `📊 Te quedan ${user.consultasRestantes} consultas legales.`);
          user.consultasRestantes = Math.max(0, user.consultasRestantes - 1);
          await user.save();
        }
      }
    }

    // Dividir mensajes largos si es necesario
    const partes = [];
    while (respuesta.length > 0) {
      partes.push(respuesta.slice(0, 4000));
      respuesta = respuesta.slice(4000);
    }

    for (let parte of partes) {
      await bot.sendMessage(chatId, parte);
    }

  } catch (err) {
    logger.error(`Telegram Error [${chatId}]: ${err.message}`);
    await bot.sendMessage(chatId, "❗ Ocurrió un error. Intentá más tarde.");
  }
});

module.exports = bot;
