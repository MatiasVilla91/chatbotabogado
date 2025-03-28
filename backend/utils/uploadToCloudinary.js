const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube un archivo a Cloudinary y devuelve la URL
 * @param {string} filePath - Ruta del archivo local
 * @returns {Promise<string>} - URL pública del archivo subido
 */
const uploadToCloudinary = async (filePath, userId = '') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "drleyes/contratos",
            public_id: `contrato_${userId}_${Date.now()}`
        });

        fs.unlinkSync(filePath); // Borrar archivo local
        return result.secure_url; // URL pública segura del PDF
    } catch (error) {
        console.error("❌ Error al subir a Cloudinary:", error);
        throw new Error("No se pudo subir el archivo.");
    }
};


module.exports = { uploadToCloudinary };
