const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/webhook', async (req, res) => {
    try {
        console.log("📝 Request Body:", req.body);  // Log para ver el contenido del body

        const { Body, From } = req.body;

        console.log(`📩 Mensaje recibido de ${From}: ${Body}`);

        // Ejemplo de respuesta simple
        const respuesta = `Hola, recibí tu mensaje: ${Body}`;

        await client.messages.create({
            body: respuesta,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: From
        });

        console.log(`✅ Mensaje enviado a ${From}`);
        res.status(200).send('Mensaje recibido');
    } catch (error) {
        console.error('❌ Error en el webhook:', error);
        res.status(500).send('Error en el webhook');
    }
});

module.exports = router;
