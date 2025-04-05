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

const uploadToCloudinary = async (filePath, userId) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw', // Para subir PDFs
            public_id: `drleyes/contratos/contrato_${userId}`,
            folder: "drleyes/contratos",
            use_filename: true,
            unique_filename: false,
            type: "upload", // Asegura que el archivo sea accesible públicamente
            access_mode: "public" // Esto garantiza el acceso público
        });
        return result.secure_url;
    } catch (error) {
        console.error("❌ Error al subir el archivo a Cloudinary:", error);
        throw new Error("Error al subir el archivo a Cloudinary");
    }
};


module.exports = { uploadToCloudinary };
