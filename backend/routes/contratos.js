const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { generarContratoIA } = require('../controllers/contratoController'); // 👈 Importar correctamente

const router = express.Router();

// ✅ Verificar si `generarContratoIA` está bien importado
console.log("📌 Funciones disponibles en contratoController:", { generarContratoIA });

// ⛔ SI TIENES ESTO (MAL), CAMBIA `get` POR `post`
router.get('/generar', checkAuth, generarContratoIA);  // ❌ ERROR porque `generarContratoIA` es POST

// ✅ SOLUCIÓN: Usa `post`, no `get`
router.post('/generar', checkAuth, generarContratoIA);

module.exports = router;
