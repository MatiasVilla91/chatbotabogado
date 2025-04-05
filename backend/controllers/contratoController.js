const { generarContratoDesdeMensaje } = require("../services/openAIService");
const { generarPDFContrato } = require("../utils/pdfGenerator");
const { uploadToCloudinary, getSecureUrl } = require("../utils/uploadToCloudinary");
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
        if (!contrato || contrato.trim() === "") {
            throw new Error("El contenido del contrato está vacío.");
        }
        console.log("📄 Contrato generado:", contrato);

        // 2️⃣ Crear PDF temporal
        const rutaPDF = await generarPDFContrato(contrato, 'contrato');
        console.log("📂 PDF generado en:", rutaPDF);

        // 3️⃣ Subir PDF a Cloudinary de forma privada
        const publicId = await uploadToCloudinary(rutaPDF, userId);
        console.log("☁️ Archivo subido de manera privada a Cloudinary");

        // 4️⃣ Guardar en MongoDB solo la URL segura
        const nuevoContrato = new Contrato({
            usuario: userId,
            mensaje_original: mensaje,
            contrato_generado: contrato,
            public_id: publicId
        });

        await nuevoContrato.save();
        console.log("✅ Contrato guardado en la base de datos.");

        res.json({ message: "Contrato generado correctamente", contratoId: nuevoContrato._id });

    } catch (error) {
        console.error("❌ Error en generarContratoIA:", error);
        res.status(500).json({ message: "Error al generar contrato", error: error.message });
    }
};

const obtenerContrato = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Buscar el contrato en la base de datos
        const contrato = await Contrato.findOne({ _id: id, usuario: userId });

        if (!contrato) {
            return res.status(404).json({ message: "Contrato no encontrado o no autorizado" });
        }

        // Generar URL segura y temporal
        const secureUrl = getSecureUrl(contrato.public_id);
        res.json({ url: secureUrl });

    } catch (error) {
        console.error("❌ Error al obtener el contrato:", error);
        res.status(500).json({ message: "Error al obtener el contrato" });
    }
};

module.exports = { generarContratoIA, obtenerContrato };
