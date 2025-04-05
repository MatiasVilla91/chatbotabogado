const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { generarRespuestaLegal, generarContratoDesdeMensaje } = require('../services/openAIService');
const { generarPDFContrato } = require('../utils/pdfGenerator');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const { ChatLegal } = require('../models/ChatLegal');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/webhook', async (req, res) => {
    try {
        const { Body, From } = req.body;
        console.log(`📩 Mensaje recibido de ${From}: ${Body}`);

        let respuesta;

        // Comando para recuperar el último contrato
        if (Body.toLowerCase().includes("/ultimo")) {
            const ultimoContrato = await ChatLegal.findOne({ usuario: From }).sort({ creado: -1 });
            if (ultimoContrato) {
                respuesta = `📄 Aquí tienes tu último contrato: ${ultimoContrato.url}`;
            } else {
                respuesta = "❗ No encontré contratos previos. Intenta generar uno nuevo.";
            }
            await client.messages.create({
                body: respuesta,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: From
            });
            return res.status(200).send('Mensaje enviado');
        }

        // Si el mensaje incluye "contrato"
        if (Body.toLowerCase().includes("contrato")) {
            try {
                // 1. Generar el contrato como texto
                const contratoTexto = await generarContratoDesdeMensaje(Body);
                if (!contratoTexto) throw new Error("No se pudo generar el contrato.");

                // 2. Crear el PDF
                const rutaPDF = await generarPDFContrato(contratoTexto, 'contrato');
                console.log("📂 PDF generado en:", rutaPDF);

                // 3. Subir el PDF a Cloudinary
                const urlPDF = await uploadToCloudinary(rutaPDF);
                console.log("☁️ URL del PDF en Cloudinary:", urlPDF);

                // 4. Guardar en la base de datos
                await ChatLegal.create({ usuario: From, url: urlPDF, mensaje: Body });

                // 5. Enviar el enlace al usuario
                respuesta = `✅ ¡Tu contrato está listo! Puedes descargarlo aquí: ${urlPDF}`;
            } catch (error) {
                console.error("❌ Error al generar o subir el contrato:", error);
                respuesta = "❗ Hubo un problema al generar el contrato. Por favor, intenta nuevamente.";
            }
        } else {
            // Respuesta legal común
            respuesta = await generarRespuestaLegal(Body);
        }

        // Enviar la respuesta final por WhatsApp
        await client.messages.create({
            body: respuesta,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: From
        });

        console.log(`✅ Mensaje enviado a ${From}: ${respuesta}`);
        res.status(200).send('Mensaje recibido');
    } catch (error) {
        console.error('❌ Error en el webhook:', error);
        res.status(500).send('Error en el webhook');
    }
});

module.exports = router;
