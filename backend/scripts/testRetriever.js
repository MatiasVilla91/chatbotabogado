// testRetriever.js

const readline = require("readline");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

// PONÉ TU CLAVE ACÁ DIRECTAMENTE
const openai = new OpenAI({
  apiKey: "ACA VA LA API", // ← tu API key
});

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
};

const embeddingsDir = path.join(__dirname, "..", "data", "embeddings_final");
const SIMILARITY_THRESHOLD = 0.78;
const MAX_TEXTO = 1000;

async function buscarFragmentosRelevantes(pregunta, topN = 5) {
  const resultado = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: pregunta,
  });

  const preguntaEmbed = resultado.data[0].embedding;
  const archivos = fs.readdirSync(embeddingsDir).filter(f => f.endsWith(".jsonl"));
  const similitudes = [];

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
              origen: archivo,
            });
          }
        }
      } catch (err) {
        console.warn(`⚠️ Línea inválida en ${archivo}, línea ${i + 1}:`, err.message);
      }
    }
  }

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

  return relevantes;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🧠 Dictum IA - Prueba de búsqueda legal por embeddings\n");

function preguntar() {
  rl.question("🔎 Ingresá tu pregunta legal: ", async (pregunta) => {
    try {
      const fragmentos = await buscarFragmentosRelevantes(pregunta, 5);
      console.log("\n📚 Fragmentos devueltos por la IA:\n");
      fragmentos.forEach((frag, i) => {
        console.log(`#${i + 1} 📁 ${frag.origen} — Score: ${frag.score.toFixed(4)}`);
        console.log(frag.texto);
        console.log("\n");
      });
    } catch (err) {
      console.error("❌ Error durante la búsqueda:", err.message);
    }

    preguntar();
  });
}

preguntar();
