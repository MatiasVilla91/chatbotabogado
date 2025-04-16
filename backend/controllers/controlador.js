const fs = require('fs');
const { body, validationResult } = require('express-validator');
const openAIService = require('../services/openAIService');
const logger = require('../utils/logger'); // 👈 Importación agregada

// Función para leer el contrato
const obtenerContrato = (req, res) => {
    try {
        const data = fs.readFileSync("contrato.json", "utf-8");
        const contrato = JSON.parse(data).texto;
        res.json({ contrato });
    } catch (error) {
        logger.error(`❌ Error al leer el contrato: ${error.message}`);
        res.status(500).json({ message: "Error al obtener el contrato." });
    }
};

const consultarContrato = async (req, res) => {
    await body('pregunta')
        .trim()
        .notEmpty()
        .withMessage("La pregunta es obligatoria.")
        .run(req);

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { pregunta } = req.body;
        logger.info(`📌 Pregunta recibida: ${pregunta}`);

        const contrato = fs.readFileSync("contrato.json", "utf-8");
        const textoContrato = JSON.parse(contrato).texto;

        const contratoRecortado = textoContrato.substring(0, 5000);

        const respuesta = await openAIService.enviarConsulta(
            `Este es el contrato en cuestión (truncado si es necesario): ${contratoRecortado}\n\n${pregunta}`
        );

        res.json({ respuesta });

    } catch (error) {
        logger.error(`❌ Error en la consulta sobre el contrato: ${error.message}`);
        res.status(500).json({ message: "Error al consultar sobre el contrato." });
    }
};

const generarContrato = async (req, res) => {
    await body('modificaciones')
        .trim()
        .notEmpty()
        .withMessage("Las modificaciones son obligatorias.")
        .run(req);

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { modificaciones } = req.body;

        const contrato = fs.readFileSync("contrato.json", "utf-8");
        const textoContrato = JSON.parse(contrato).texto;

        const nuevoContrato = await openAIService.enviarConsulta(
            `Aquí tienes un contrato base: ${textoContrato}.\n\nPor favor, genera un nuevo contrato basado en el anterior con las siguientes modificaciones: ${modificaciones}`
        );

        res.json({ contrato: nuevoContrato });

    } catch (error) {
        logger.error(`❌ Error en la generación del contrato: ${error.message}`);
        res.status(500).json({ message: "Error al generar el contrato." });
    }
};

module.exports = { obtenerContrato, consultarContrato, generarContrato };
