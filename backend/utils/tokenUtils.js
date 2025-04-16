// utils/tokenUtils.js
const { encode } = require('gpt-3-encoder');

function calcularTokensTotales(messages) {
  return messages.reduce((acc, msg) => acc + encode(msg.content).length, 0);
}

function truncarHistorialPorTokens(messages, maxTokens) {
  let truncado = messages.slice();
  while (calcularTokensTotales(truncado) > maxTokens) {
    truncado.shift(); // elimina el mensaje más viejo
  }
  return truncado;
}

module.exports = { calcularTokensTotales, truncarHistorialPorTokens };
