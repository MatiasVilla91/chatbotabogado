const fs = require('fs');
const openAIService = require('../services/openAIService');

// Función para leer el contrato
const obtenerContrato = (req, res) => {
    try {
        const data = fs.readFileSync("contrato.json", "utf-8");
        const contrato = JSON.parse(data).texto;
        res.json({ contrato });
    } catch (error) {
        console.error("❌ Error al leer el contrato:", error);
        res.status(500).json({ message: "Error al obtener el contrato." });
    }
};

const consultarContrato = async (req, res) => {
    try {
        const { pregunta } = req.body;
        console.log("📌 Pregunta recibida:", pregunta);

        if (!pregunta) {
            return res.status(400).json({ message: "Debes proporcionar una pregunta válida." });
        }

        const contrato = fs.readFileSync("contrato.json", "utf-8");
        const textoContrato = JSON.parse(contrato).texto;

        console.log("📌 Longitud del contrato antes de recorte:", textoContrato.length);

        // 🔹 Limitar a 5000 caracteres para evitar el error de contexto excesivo
        const contratoRecortado = textoContrato.substring(0, 5000);

        console.log("📌 Longitud del contrato después de recorte:", contratoRecortado.length);

        const respuesta = await openAIService.enviarConsulta(
            `Este es el contrato en cuestión (truncado si es necesario): ${contratoRecortado}\n\n${pregunta}`
        );

        res.json({ respuesta });

    } catch (error) {
        console.error("❌ Error en la consulta sobre el contrato:", error);
        res.status(500).json({ message: "Error al consultar sobre el contrato." });
    }
};

// Función para generar un nuevo contrato basado en el existente
const generarContrato = async (req, res) => {
    try {
        const { modificaciones } = req.body;
        if (!modificaciones) {
            return res.status(400).json({ message: "Debes proporcionar detalles sobre las modificaciones." });
        }

        const contrato = fs.readFileSync("contrato.json", "utf-8");
        const textoContrato = JSON.parse(contrato).texto;

        const nuevoContrato = await openAIService.enviarConsulta(
            `Aquí tienes un contrato base: ${textoContrato}.\n\nPor favor, genera un nuevo contrato basado en el anterior con las siguientes modificaciones: ${modificaciones}`
        );

        res.json({ contrato: nuevoContrato });

    } catch (error) {
        console.error("❌ Error en la generación del contrato:", error);
        res.status(500).json({ message: "Error al generar el contrato." });
    }
};

module.exports = { obtenerContrato, consultarContrato, generarContrato };
