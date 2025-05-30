const User = require('../models/User');

const verificarLimite = (tipo) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // 👑 Cuenta maestra: acceso total
    if (user.rol === "maestro") return next();

    // ✅ Premium: acceso libre
    if (user.esPremium) return next();

    // 🚫 Chequeo de límites para plan gratuito
    if (tipo === 'consulta' && user.consultasRestantes <= 0) {
      return res.status(403).json({
        message: "Tu límite de consultas gratuitas ha terminado. Actualizá a Premium.",
      });
    }

    if (tipo === 'contrato' && user.contratosRestantes <= 0) {
      return res.status(403).json({
        message: "Tu límite de contratos gratuitos ha terminado. Actualizá a Premium.",
      });
    }

    // ✅ Resta un uso y permite continuar
    const campo = tipo === 'consulta' ? 'consultasRestantes' : 'contratosRestantes';
    await User.findByIdAndUpdate(req.user.id, { $inc: { [campo]: -1 } });

    next();
  };
};

module.exports = { verificarLimite };
