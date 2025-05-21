const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const { cosineSimilarity } = require("../utils/similarity");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const embeddingsDir = path.join(__dirname, "..", "data", "embeddings_final");

async function buscarFragmentosRelevantes(pregunta, topN = 5) {
  // 1. Generar embedding de la pregunta
  const resultado = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: pregunta
  });

  const preguntaEmbed = resultado.data[0].embedding;
  console.log("\n🧪 Embedding generado para la pregunta:", preguntaEmbed.length, "dimensiones");

  const archivos = fs.readdirSync(embeddingsDir).filter(f => f.endsWith(".jsonl"));
  let similitudes = [];

  // 2. Leer embeddings por archivo (uno por uno)
  for (const archivo of archivos) {
    const ruta = path.join(embeddingsDir, archivo);
    const lineas = fs.readFileSync(ruta, "utf-8").split("\n");

    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (!linea) continue;

      try {
        const json = JSON.parse(linea);
        const vector = json.embeddings || json.embedding;
        const texto = json.texto || json.fragmento;

        if (vector && texto && Array.isArray(vector)) {
          const score = cosineSimilarity(vector, preguntaEmbed);
          similitudes.push({ texto, score, origen: archivo });
        }
      } catch (err) {
        console.warn(`⚠️ Línea inválida en ${archivo} línea ${i + 1}:`, err.message);
      }
    }
  }

  // 3. Ordenar por similitud
  const relevantes = similitudes
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // Mostrar en consola
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
