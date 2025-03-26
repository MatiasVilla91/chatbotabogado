const { generarContratoDesdeMensaje } = require("../services/openaiService");
const { generarPDFContrato } = require("../utils/pdfGenerator");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const Contrato = require("../models/Contrato");

const generarContratoIA = async (req, res) => {
    try {
        const { mensaje } = req.body;
        const userId = req.user.id; // ID del usuario autenticado

        if (!mensaje || typeof mensaje !== "string") {
            return res.status(400).json({ message: "Debes proporcionar un mensaje válido." });
        }

        console.log("📌 Mensaje recibido:", mensaje);

        // 1️⃣ Generar contrato en texto
        const contrato = await generarContratoDesdeMensaje(mensaje);
        console.log("📄 Contrato generado:", contrato);

        // 2️⃣ Crear PDF temporal
        const rutaPDF = await generarPDFContrato(contrato, 'contrato');
        console.log("📂 PDF generado en:", rutaPDF);

        // 3️⃣ Subir PDF a Cloudinary
        const urlPDF = await uploadToCloudinary(rutaPDF);
        console.log("☁️ URL del PDF en Cloudinary:", urlPDF);

        // 4️⃣ Guardar en MongoDB solo la URL del PDF
        const nuevoContrato = new Contrato({
            usuario: userId,
            mensaje_original: mensaje,
            contrato_generado: contrato,
            ruta_pdf: urlPDF
        });

        await nuevoContrato.save();
        console.log("✅ Contrato guardado en la base de datos.");

        res.json({ contrato, urlPDF });

    } catch (error) {
        console.error("❌ Error en generarContratoIA:", error);
        res.status(500).json({ message: "Error al generar contrato", error: error.message });
    }
};

module.exports = { generarContratoIA };
