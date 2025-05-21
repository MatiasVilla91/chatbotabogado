require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📁 Carpetas
const CARPETA_ENTRADA = path.join(__dirname, "data", "filtrados"); // usar solo los datos limpios
const CARPETA_SALIDA = path.join(__dirname, "data", "embeddings_final");
fs.mkdirSync(CARPETA_SALIDA, { recursive: true });

async function generarEmbedding(texto) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texto,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("❌ Error al generar embedding:", error.message);
    return null;
  }
}

(async () => {
  const archivos = fs.readdirSync(CARPETA_ENTRADA).filter(f => f.endsWith(".jsonl"));

  for (const archivo of archivos) {
    const rutaIn = path.join(CARPETA_ENTRADA, archivo);
    const nombreBase = archivo.replace(".jsonl", "");
    const rutaOut = path.join(CARPETA_SALIDA, `${nombreBase}_embeddings.jsonl`);

    console.log(`📁 Procesando: ${archivo}`);
    let total = 0, errores = 0;

    const lineas = fs.readFileSync(rutaIn, "utf-8").split("\n");
    const salida = fs.createWriteStream(rutaOut, { flags: "w", encoding: "utf-8" });

    for (const linea of lineas) {
      if (!linea.trim()) continue;
      try {
        const data = JSON.parse(linea);
        const texto = data.fragmento || data.texto || "";
        if (!texto) continue;

        const vector = await generarEmbedding(texto);
        if (!vector) {
          errores++;
          continue;
        }

        const resultado = {
          texto,
          embedding: vector,
          categoria: data.categoria || "",
          origen: archivo
        };

        salida.write(JSON.stringify(resultado) + "\n");
        total++;
      } catch (err) {
        errores++;
        console.warn("⚠️ Línea con error:", err.message);
      }
      await new Promise(r => setTimeout(r, 300)); // para evitar rate limits
    }

    salida.end();
    console.log(`✅ ${total} fragmentos procesados — ❌ ${errores} errores\n`);
  }
})();
