const axios = require('axios');
const tests = require('./evaluacion_test.json');

// ⚠️ Pegá aquí un JWT real generado al iniciar sesión
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDYzZGRhNWY3OTMxYWI4MTg2ZDdlMCIsImlhdCI6MTc0Nzc5MTA0MCwiZXhwIjoxNzQ3ODM0MjQwfQ._fTHIszfWNAlv7HHhSxAPoKlyasiC8jpq4WAAp8u6-c';

async function runTests() {
  for (const test of tests) {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/legal/consulta',
        {
          pregunta: test.pregunta,
          modoLegal: 'profesional'
        },
        {
          headers: {
            Authorization: TOKEN,
            'Content-Type': 'application/json'
          }
        }
      );

      const respuesta = res.data.respuesta.toLowerCase();
      const hits = test.esperado.filter(palabra =>
        respuesta.includes(palabra.toLowerCase())
      );

      console.log(`❓ Pregunta: ${test.pregunta}`);
      console.log(`🧠 Respuesta: ${respuesta.slice(0, 200)}...`);
      console.log(`✅ Palabras clave encontradas: ${hits.length}/${test.esperado.length} →`, hits);
      console.log(hits.length === test.esperado.length ? '✔️ COMPLETO' : '⚠️ INCOMPLETO');
      console.log('---------------------------\n');

    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error(`❌ Error en: ${test.pregunta}`);
      console.error('📩 Detalle:', msg);
      console.log('---------------------------\n');
    }
  }
}

runTests();
