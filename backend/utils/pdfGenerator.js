// utils/pdfGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF a partir de un texto legal.
 * @param {string} texto - El contenido del contrato.
 * @param {string} nombreArchivo - Nombre base del archivo sin extensión.
 * @returns {Promise<string>} Ruta del archivo PDF generado.
 */
const generarPDFContrato = (texto, nombreArchivo = 'contrato') => {
    return new Promise((resolve, reject) => {
        try {
            const rutaCarpeta = path.join(__dirname, '..', 'contratos');
            if (!fs.existsSync(rutaCarpeta)) {
                fs.mkdirSync(rutaCarpeta);
            }

            const rutaPDF = path.join(rutaCarpeta, `${nombreArchivo}_${Date.now()}.pdf`);
            const doc = new PDFDocument({ margin: 40 });
            const writeStream = fs.createWriteStream(rutaPDF);

            doc.pipe(writeStream);
            doc.font('Times-Roman').fontSize(12).text(texto, {
                align: 'justify',
                lineGap: 6
            });

            doc.end();

            writeStream.on('finish', () => {
                resolve(rutaPDF);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generarPDFContrato };