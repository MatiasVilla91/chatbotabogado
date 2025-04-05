const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube un archivo a Cloudinary y devuelve la URL pública
 * @param {string} filePath - Ruta del archivo local
 * @returns {Promise<string>} - URL pública del archivo subido
 */
const uploadToCloudinary = async (filePath, userId = '') => {
    try {
        // Configuración para subir como archivo accesible públicamente
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto", // Cambiado de "raw" a "auto" para que detecte el tipo
            folder: "drleyes/contratos",
            public_id: `contrato_${userId}_${Date.now()}`,
            format: "pdf", // Asegura que el archivo sea un PDF
            type: "upload", // Tipo de carga pública
            use_filename: true, // Mantener el nombre del archivo
            unique_filename: false, // No generar un nombre aleatorio
        });

        fs.unlinkSync(filePath); // Borrar el archivo local después de subir
        console.log("☁️ URL del PDF en Cloudinary:", result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error("❌ Error al subir a Cloudinary:", error);
        throw new Error("No se pudo subir el archivo.");
    }
};

module.exports = { uploadToCloudinary };
