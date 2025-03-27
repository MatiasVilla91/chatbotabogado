const User = require('../models/User');

const verificarLimite = (tipo) => {
    return async (req, res, next) => {
        const user = await User.findById(req.user.id);
        if (user.email === "mati") return next(); // 👑 Vos pasás siempre


        if (user.esPremium) return next();

        if (tipo === 'consulta' && user.consultasRestantes <= 0) {
            return res.status(403).json({ message: "Tu límite de consultas gratuitas ha terminado. Actualizá a Premium." });
        }

        if (tipo === 'contrato' && user.contratosRestantes <= 0) {
            return res.status(403).json({ message: "Tu límite de contratos gratuitos ha terminado. Actualizá a Premium." });
        }

        // Restamos 1 al contador
        const campo = tipo === 'consulta' ? 'consultasRestantes' : 'contratosRestantes';
        await User.findByIdAndUpdate(req.user.id, { $inc: { [campo]: -1 } });

        next();
    };
};

module.exports = { verificarLimite };
