const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Función genérica para hacer una consulta a OpenAI
const generarRespuesta = async (modelo, mensajes, temperatura, maxTokens) => {
    try {
        const response = await openai.chat.completions.create({
            model: modelo,
            messages: mensajes,
            temperature: temperatura,
            max_tokens: maxTokens
        });
        return response.choices?.[0]?.message?.content || "No se pudo generar la respuesta.";
    } catch (error) {
        console.error("❌ Error al generar respuesta:", error);
        return "Hubo un problema al generar la respuesta.";
    }
};

// Función para generar respuestas legales generales
const generarRespuestaLegal = async (mensaje) => {
    const mensajes = [
        {
            role: "system",
            content: `Eres un abogado experto en derecho argentino. Responde consultas legales de manera clara, precisa y fundamentada.`
        },
        {
            role: "user",
            content: mensaje
        }
    ];
    return await generarRespuesta("gpt-4", mensajes, 0.4, 1000);
};

// Función para generar contratos legales
const generarContratoDesdeMensaje = async (mensaje) => {
    const mensajes = [
        {
            role: "system",
            content: `Eres un redactor legal experto en contratos argentinos. Generás contratos claros y jurídicamente sólidos.`
        },
        {
            role: "user",
            content: mensaje
        }
    ];
    return await generarRespuesta("gpt-4", mensajes, 0.2, 1500);
};

// Función para generar respuestas con contexto (historial)
const generarRespuestaConContexto = async (mensaje, historial) => {
    const mensajes = [
        {
            role: "system",
            content: `Eres un asistente legal experto en derecho Argentino diseñado exclusivamente para abogados profesionales. Responde consultas complejas usando el contexto del historial.`
        },
        ...historial,
        { role: "user", content: mensaje }
    ];
    return await generarRespuesta("gpt-4", mensajes, 0.2, 1000);
};

module.exports = { generarRespuestaLegal, generarContratoDesdeMensaje, generarRespuestaConContexto };
