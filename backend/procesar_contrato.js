const fs = require("fs");
const pdfParse = require("pdf-parse");

const leerContrato = async (rutaPDF) => {
    try {
        const dataBuffer = fs.readFileSync(rutaPDF);
        const data = await pdfParse(dataBuffer);

        const textoLimpio = data.text.replace(/\n+/g, " ").trim();
        fs.writeFileSync("contrato.json", JSON.stringify({ texto: textoLimpio }, null, 4));

        console.log("✅ Texto extraído y guardado en contrato.json");
    } catch (error) {
        console.error("❌ Error al procesar el PDF:", error);
    }
};

leerContrato("contrato.pdf"); // Cambia esto por la ruta de tu PDF