const { generarContratoDesdeMensaje } = require("../services/openAIService");
const { generarPDFContrato } = require("../utils/pdfGenerator");
const { uploadToCloudinary, getSecureUrl } = require("../utils/uploadToCloudinary");
const Contrato = require("../models/Contrato");
const logger = require("../utils/logger"); // 👈 Agregado

const { body, validationResult } = require('express-validator');

const generarContratoIA = async (req, res) => {
    try {
        const { mensaje } = req.body;
        const userId = req.user.id;

        if (!mensaje || typeof mensaje !== "string") {
            return res.status(400).json({ message: "Debes proporcionar un mensaje válido." });
        }

        logger.info(`📌 Mensaje recibido: ${mensaje}`);

        // 1️⃣ Generar contrato en texto
        const contrato = await generarContratoDesdeMensaje(mensaje);
        if (!contrato || contrato.trim() === "") {
            throw new Error("El contenido del contrato está vacío.");
        }
        logger.info("📄 Contrato generado correctamente.");

        // 2️⃣ Crear PDF temporal
        const rutaPDF = await generarPDFContrato(contrato, 'contrato');
        logger.info(`📂 PDF generado en: ${rutaPDF}`);

        // 3️⃣ Subir PDF a Cloudinary
        const publicId = await uploadToCloudinary(rutaPDF, userId);
        logger.info("☁️ Archivo subido de manera privada a Cloudinary.");

        // 4️⃣ Guardar en la base de datos
        const nuevoContrato = new Contrato({
            usuario: userId,
            mensaje_original: mensaje,
            contrato_generado: contrato,
            public_id: publicId
        });

        await nuevoContrato.save();
        logger.info("✅ Contrato guardado en la base de datos.");

        res.json({ message: "Contrato generado correctamente", contratoId: nuevoContrato._id });

    } catch (error) {
        logger.error(`❌ Error en generarContratoIA: ${error.message}`);
        res.status(500).json({ message: "Error al generar contrato", error: error.message });
    }
};

const obtenerContrato = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const contrato = await Contrato.findOne({ _id: id, usuario: userId });

        if (!contrato) {
            return res.status(404).json({ message: "Contrato no encontrado o no autorizado" });
        }

        const secureUrl = getSecureUrl(contrato.public_id);
        res.json({ url: secureUrl });

    } catch (error) {
        logger.error(`❌ Error al obtener el contrato: ${error.message}`);
        res.status(500).json({ message: "Error al obtener el contrato" });
    }
};

module.exports = { generarContratoIA, obtenerContrato };
