const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { generarRespuestaLegal, generarContratoDesdeMensaje } = require('../services/openAIService');
const { generarPDFContrato } = require('../utils/pdfGenerator');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/webhook', async (req, res) => {
    try {
        const { Body, From } = req.body;
        console.log(`📩 Mensaje recibido de ${From}: ${Body}`);

        let respuesta;

        if (Body.toLowerCase().includes("contrato")) {
            // 1. Generar el contrato como texto
            const contratoTexto = await generarContratoDesdeMensaje(Body);
            if (!contratoTexto) {
                throw new Error("No se pudo generar el contrato.");
            }

            // 2. Crear el PDF desde el contrato generado
            const rutaPDF = await generarPDFContrato(contratoTexto, 'contrato');
            console.log("📂 PDF generado en:", rutaPDF);

            // 3. Subir el PDF a Cloudinary
            const urlPDF = await uploadToCloudinary(rutaPDF);
            console.log("☁️ URL del PDF en Cloudinary:", urlPDF);

            // 4. Enviar el enlace por WhatsApp
            respuesta = `Tu contrato ha sido generado exitosamente. Puedes descargarlo desde el siguiente enlace: ${urlPDF}`;
        } else {
            // Respuesta legal normal
            respuesta = await generarRespuestaLegal(Body);
        }

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
