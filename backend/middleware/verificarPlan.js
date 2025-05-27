const User = require('../models/User');

async function verificarPlan(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    if (user.esPremium && user.fechaFinPremium) {
      const hoy = new Date();
      if (hoy > user.fechaFinPremium) {
        // Expiró el plan
        await User.findByIdAndUpdate(user._id, {
          esPremium: false,
          consultasRestantes: 5,
          contratosRestantes: 3,
          fechaInicioPremium: null,
          fechaFinPremium: null
        });
        console.log("⏳ Plan Premium expirado para:", user.email);
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error en verificación de plan:", error);
    res.status(500).json({ message: 'Error verificando plan' });
  }
}

module.exports = verificarPlan;
