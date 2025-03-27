const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkAuth } = require('../middleware/auth');

// ✅ Ruta para actualizar después del pago
router.post('/upgrade', checkAuth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            esPremium: true,
            consultasRestantes: 9999,
            contratosRestantes: 9999
        });

        res.json({ message: "¡Tu cuenta fue actualizada a Premium!" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
});

module.exports = router;
