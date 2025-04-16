const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { generarContratoIA } = require('../controllers/contratoController'); // 👈 Importar correctamente
const { verificarLimite } = require('../middleware/limites');
const { body, validationResult } = require('express-validator');



const router = express.Router();

// ✅ Verificar si `generarContratoIA` está bien importado
console.log("📌 Funciones disponibles en contratoController:", { generarContratoIA });

// ⛔ SI TIENES ESTO (MAL), CAMBIA `get` POR `post`
//router.get('/generar', checkAuth, generarContratoIA);  // ❌ ERROR porque `generarContratoIA` es POST



// ✅ SOLUCIÓN: Usa `post`, no `get`
//router.post('/generar', checkAuth, verificarLimite('contrato'), generarContratoIA);

router.post(
    '/generar',
    checkAuth,
    verificarLimite('contrato'),
    body('mensaje')
      .trim()
      .notEmpty()
      .withMessage("El mensaje es obligatorio para generar un contrato."),
    async (req, res) => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }
  
      // ✅ Si pasa validación, se llama al controlador
      return generarContratoIA(req, res);
    }
  );
  


module.exports = router;
