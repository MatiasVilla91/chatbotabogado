const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const { cosineSimilarity } = require("../utils/similarity");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const embeddingsDir = path.join(__dirname, "..", "data", "embeddings_final");

let baseEmbeddings = [];

function cargarEmbeddings() {
  const archivos = fs.readdirSync(embeddingsDir).filter(f => f.endsWith(".jsonl"));
  console.log("📁 Archivos encontrados:", archivos.length);

  archivos.forEach(nombre => {
    const ruta = path.join(embeddingsDir, nombre);
    console.log("📄 Leyendo archivo:", nombre);

    const contenido = fs.readFileSync(ruta, "utf-8");

    contenido.split("\n").forEach((linea, index) => {
      if (!linea.trim()) return;

      try {
        const json = JSON.parse(linea);
        const vector = json.embeddings || json.embedding;
        const texto = json.texto || json.fragmento;

        if (!vector || !Array.isArray(vector)) {
          console.warn(`⚠️ Vector inválido en ${nombre}, línea ${index + 1}`);
          return;
        }

        if (vector.length < 100) {
          console.warn(`❌ Embedding sospechosamente corto en ${nombre}, línea ${index + 1} (${vector.length} dimensiones)`);
        }

        if (texto) {
          baseEmbeddings.push({
            texto,
            embeddings: vector,
            origen: nombre
          });
        }
      } catch (err) {
        console.warn(`⚠️ Línea inválida en ${nombre}, línea ${index + 1}:`, err.message);
      }
    });
  });

  console.log("✅ Embeddings legales cargados:", baseEmbeddings.length);

  // Resumen por archivo
  const porArchivo = {};
  baseEmbeddings.forEach(e => {
    porArchivo[e.origen] = (porArchivo[e.origen] || 0) + 1;
  });

  console.log("📊 Fragmentos por archivo:");
  Object.entries(porArchivo).forEach(([archivo, cantidad]) => {
    console.log(`   📁 ${archivo}: ${cantidad} fragmentos`);
  });
}

async function buscarFragmentosRelevantes(pregunta, topN = 5) {
  const resultado = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: pregunta
  });

  const preguntaEmbed = resultado.data[0].embedding;

  console.log("\n🧪 Embedding generado para la pregunta:", preguntaEmbed.length, "dimensiones");

  const similitudes = baseEmbeddings.map(obj => ({
    texto: obj.texto,
    origen: obj.origen || "desconocido",
    score: cosineSimilarity(obj.embeddings, preguntaEmbed)
  }));

  const relevantes = similitudes
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // 📊 Mostrar en consola los fragmentos seleccionados
  console.log(`\n🧠 Pregunta: "${pregunta}"`);
  console.log("🔍 Fragmentos más relevantes:");
  relevantes.forEach((frag, i) => {
    console.log(`\n#${i + 1} 📁 ${frag.origen} — Score: ${frag.score.toFixed(4)}`);
    console.log(frag.texto.slice(0, 300) + "...\n");
  });

  return relevantes.map(r => r.texto);
}

module.exports = {
  cargarEmbeddings,
  buscarFragmentosRelevantes,
};
