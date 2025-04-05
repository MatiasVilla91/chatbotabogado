const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/webhook', async (req, res) => {
    const { Body, From } = req.body;

    console.log(`📩 Mensaje recibido de ${From}: ${Body}`);

    // Llamada a OpenAI para generar la respuesta del bot
    const respuesta = await generarRespuestaLegal(Body);

    client.messages.create({
        body: respuesta,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: From
    }).then((message) => {
        console.log(`✅ Mensaje enviado: ${message.sid}`);
        res.status(200).send('Mensaje recibido');
    }).catch((err) => {
        console.error('❌ Error al enviar el mensaje:', err);
        res.status(500).send('Error al enviar el mensaje');
    });
});

module.exports = router;
