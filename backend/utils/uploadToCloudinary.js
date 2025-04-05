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
 * @param {string} userId - ID del usuario (opcional)
 * @returns {Promise<string>} - URL pública del archivo subido
 */
const uploadToCloudinary = async (filePath, userId = '') => {
    try {
        // Configuración para subir como archivo accesible públicamente
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw", // Garantiza que el archivo PDF sea tratado correctamente
            folder: "drleyes/contratos",
            public_id: `contrato_${userId}_${Date.now()}`,
            format: "pdf", // Asegura que el archivo tenga extensión PDF
            use_filename: true, // Mantener el nombre del archivo
            unique_filename: false, // No generar un nombre aleatorio
            access_mode: "public" // Asegura que el archivo tenga acceso público
        });

        // Borrar el archivo local después de subir
        fs.unlinkSync(filePath); 
        console.log("☁️ URL del PDF en Cloudinary:", result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error("❌ Error al subir a Cloudinary:", error);
        throw new Error("No se pudo subir el archivo.");
    }
};

module.exports = { uploadToCloudinary };
