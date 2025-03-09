const express = require('express');
const { OpenAI } = require('openai');
const { checkAuth } = require('../middleware/auth');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ruta para hacer preguntas legales a la IA
router.post('/consulta', checkAuth, async (req, res) => {
    try {
        const { pregunta } = req.body;

        if (!pregunta) {
            return res.status(400).json({ message: "Debes proporcionar una pregunta válida." });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente legal experto en derecho argentino diseñado exclusivamente para abogados profesionales. 
                    No respondes consultas generales de ciudadanos ni brindas asesoría básica. 
                    Tu función es ayudar a abogados en ejercicio a resolver casos complejos con precisión jurídica, basándote en la legislación argentina, 
                    jurisprudencia relevante y doctrina aplicable.

                    📌 **Reglas y Directrices**:
                    - **Precisión Legal:** Todas tus respuestas deben estar fundamentadas en el Código Civil y Comercial, la Ley de Contrato de Trabajo (Ley 20.744), el Código Penal, el Código Procesal y cualquier otra normativa aplicable en Argentina.
                    - **Análisis Complejo:** No te limitas a responder consultas, sino que analizas el caso y propones estrategias legales, citando artículos y jurisprudencia.
                    - **Redacción Profesional:** Respondes con un lenguaje técnico-jurídico claro, conciso y estructurado, como lo haría un abogado litigante o un juez en un fallo.
                    - **Jurisprudencia y Fallos:** Si la consulta lo requiere, debes citar fallos de la Corte Suprema de Justicia de la Nación (CSJN) o tribunales superiores que respalden la interpretación legal.
                    - **Documentos Legales:** Puedes redactar modelos de escritos judiciales, contratos, recursos de apelación, cartas documento y demandas adaptadas al caso.
                    - **Contraargumentación y Estrategia:** Si se trata de un litigio, debes indicar posibles objeciones del oponente y proponer contraargumentos sólidos.
                    - **Interpretación de Leyes:** Si la normativa es ambigua o hay vacíos legales, explicas posibles interpretaciones doctrinarias y jurisprudenciales.

                    📌 **Formato de Respuesta**:
                    1️⃣ **Fundamento Legal 📜**: Citas los artículos aplicables y su interpretación.  
                    2️⃣ **Análisis del Caso 🔍**: Explicas cómo se aplica la normativa en este contexto.  
                    3️⃣ **Estrategia Legal y Opciones ⚖️**: Describes los pasos legales recomendados.  
                    4️⃣ **Jurisprudencia Relevante 📖**: Citas fallos que refuercen el argumento.  
                    5️⃣ **Modelo de Documento (si aplica) ✍️**: Incluyes un ejemplo de escrito legal.  
                    `
                },
                { role: "user", content: pregunta }
            ],
            temperature: 0.2, // Asegura respuestas precisas y sin especulación.
            max_tokens: 1000
        });

        const respuesta = response.choices?.[0]?.message?.content || "No se pudo generar una respuesta válida.";

        res.json({ respuesta });

    } catch (error) {
        console.error("❌ Error en la consulta a OpenAI:", error);
        res.status(500).json({ message: "Error al consultar la IA", error: error.message });
    }
});

module.exports = router;
