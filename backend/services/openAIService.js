const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generarContratoDesdeMensaje = async (mensaje) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `Eres un redactor legal experto en contratos argentinos. 
Generás contratos profesionales a partir de instrucciones en lenguaje natural, respetando la legislación vigente 
(Código Civil y Comercial, Ley 20.744, etc). Tu redacción debe ser formal, clara y jurídicamente sólida.`
            },
            {
                role: "user",
                content: mensaje
            }
        ],
        temperature: 0.2,
        max_tokens: 1500
    });

    return response.choices?.[0]?.message?.content || "No se pudo generar el contrato.";
};

module.exports = { generarContratoDesdeMensaje };
