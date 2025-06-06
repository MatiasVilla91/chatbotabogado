require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const { cosineSimilarity } = require("../utils/similarity");



const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const embeddingsDir = path.join(__dirname, "..", "data", "embeddings_final");
const SIMILARITY_THRESHOLD = 0.78; // configurable
const MAX_TEXTO = 1000;

async function buscarFragmentosRelevantes(pregunta, topN = 5) {
  // 1. Generar embedding para la pregunta
  const resultado = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: pregunta
  });

  const preguntaEmbed = resultado.data[0].embedding;
  console.log("\n🧪 Embedding generado para la pregunta:", preguntaEmbed.length, "dimensiones");

  const archivos = fs.readdirSync(embeddingsDir).filter(f => f.endsWith(".jsonl"));
  const similitudes = [];

  // 2. Recorrer cada archivo de embeddings
  for (const archivo of archivos) {
    const ruta = path.join(embeddingsDir, archivo);
    const lineas = fs.readFileSync(ruta, "utf-8").split("\n");

    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (!linea) continue;

      try {
        const json = JSON.parse(linea);
        const vector = json.embedding;
        const texto = json.texto;

        if (vector && texto && Array.isArray(vector)) {
          const score = cosineSimilarity(vector, preguntaEmbed);
          if (score >= SIMILARITY_THRESHOLD) {
            similitudes.push({
              texto: texto.trim().slice(0, MAX_TEXTO),
              score,
              origen: archivo
            });
          }
        }
      } catch (err) {
        console.warn(`⚠️ Línea inválida en ${archivo}, línea ${i + 1}:`, err.message);
      }
    }
  }

  // 3. Ordenar por score y eliminar duplicados
  const únicos = new Set();
  const relevantes = similitudes
    .sort((a, b) => b.score - a.score)
    .filter(item => {
      const hash = item.texto;
      if (únicos.has(hash)) return false;
      únicos.add(hash);
      return true;
    })
    .slice(0, topN);

  // Mostrar para depuración
  console.log(`\n🧠 Pregunta: "${pregunta}"`);
  console.log("🔍 Fragmentos más relevantes:");
  relevantes.forEach((frag, i) => {
    console.log(`#${i + 1} 📁 ${frag.origen} — Score: ${frag.score.toFixed(4)}`);
    console.log(frag.texto.slice(0, 300) + "...\n");
  });

  return relevantes.map(r => r.texto);
}

module.exports = {
  buscarFragmentosRelevantes
};
