const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // 👈 agregado

const checkAuth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        logger.warn('❌ Intento de acceso sin token');
        return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        logger.warn(`❌ Token inválido: ${error.message}`);
        res.status(400).json({ message: 'Token inválido.' });
    }
};

module.exports = { checkAuth };
