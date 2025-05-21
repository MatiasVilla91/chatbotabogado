const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '../data/embeddings_final/familia_anon_embeddings.jsonl'); // <-- CAMBIÁ ESTO
const tamañoMáximo = 50 * 1024 * 1024; // 50 MB por archivo
const carpetaSalida = path.join(__dirname, '../data/embeddings_final/divididos');

let parte = 1;
let buffer = '';
let tamañoActual = 0;

const nombreBase = path.basename(rutaArchivo, '.jsonl');

const contenido = fs.readFileSync(rutaArchivo, 'utf-8').split('\n');

contenido.forEach((linea, i) => {
  const lineaConSalto = linea + '\n';
  const pesoLinea = Buffer.byteLength(lineaConSalto);

  if (tamañoActual + pesoLinea > tamañoMáximo && buffer.length > 0) {
    const archivoNuevo = path.join(carpetaSalida, `${nombreBase}_parte${parte}.jsonl`);
    fs.writeFileSync(archivoNuevo, buffer);
    console.log(`✅ Guardado: ${archivoNuevo}`);
    parte++;
    buffer = '';
    tamañoActual = 0;
  }

  buffer += lineaConSalto;
  tamañoActual += pesoLinea;
});

// Guardar el último fragmento si quedó algo pendiente
if (buffer.length > 0) {
  const archivoFinal = path.join(carpetaSalida, `${nombreBase}_parte${parte}.jsonl`);
  fs.writeFileSync(archivoFinal, buffer);
  console.log(`✅ Guardado: ${archivoFinal}`);
}

console.log('🎉 División completada.');
