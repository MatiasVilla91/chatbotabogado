const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube un archivo a Cloudinary y devuelve el public_id
 * @param {string} filePath - Ruta del archivo local
 * @param {string} userId - ID del usuario (opcional)
 * @returns {Promise<string>} - ID público del archivo subido
 */
const uploadToCloudinary = async (filePath, userId = '') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "drleyes/contratos",
            public_id: `contrato_${userId}_${Date.now()}`,
            format: "pdf",
            use_filename: true,
            unique_filename: false,
            type: "private", // Archivos privados
            access_mode: "authenticated" // Solo accesible con token
        });
        fs.unlinkSync(filePath);
        console.log("☁️ PDF subido de manera privada a Cloudinary:", result.public_id);
        return result.public_id;
    } catch (error) {
        console.error("❌ Error al subir a Cloudinary:", error);
        throw new Error("No se pudo subir el archivo.");
    }
};

/**
 * Genera una URL segura y temporal para descargar el archivo desde Cloudinary
 * @param {string} publicId - ID público del archivo en Cloudinary
 * @returns {string} - URL segura y temporal
 */
const getSecureUrl = (publicId) => {
    try {
        const secureUrl = cloudinary.url(publicId, {
            resource_type: "raw",
            type: "private", // Asegura que el acceso sea restringido
            sign_url: true,  // Firma la URL para evitar acceso público
            secure: true,    // URL segura (https)
            transformation: [
                { flags: "attachment" } // Forzar la descarga en lugar de abrir en el navegador
            ],
            expires_at: Math.floor(Date.now() / 1000) + 3600 // Expira en una hora
        });
        console.log("🔑 URL segura generada:", secureUrl);
        return secureUrl;
    } catch (error) {
        console.error("❌ Error al generar la URL segura:", error);
        throw new Error("No se pudo generar la URL segura.");
    }
};

module.exports = { uploadToCloudinary, getSecureUrl };
