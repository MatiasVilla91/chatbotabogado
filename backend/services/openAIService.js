const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Función para generar respuestas legales generales
const generarRespuestaLegal = async (mensaje) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `Eres un abogado experto en derecho argentino. 
                    Responde consultas legales de manera clara, precisa y fundamentada, siguiendo la normativa vigente 
                    (Código Civil y Comercial, Ley 20.744, etc).`
                },
                {
                    role: "user",
                    content: mensaje
                }
            ],
            temperature: 0.4,
            max_tokens: 1000
        });

        return response.choices?.[0]?.message?.content || "No se pudo generar la respuesta legal.";
    } catch (error) {
        console.error("❌ Error al generar respuesta legal:", error);
        return "Hubo un problema al generar la respuesta legal.";
    }
};

// Función para generar contratos legales
const generarContratoDesdeMensaje = async (mensaje) => {
    try {
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
    } catch (error) {
        console.error("❌ Error al generar el contrato:", error);
        return "Hubo un problema al generar el contrato.";
    }
};

module.exports = { generarRespuestaLegal, generarContratoDesdeMensaje };
