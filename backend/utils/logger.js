// utils/logger.js
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(), // Colores en consola
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
  ),
  transports: [
    new transports.Console(),
    // Descomenta para guardar en archivo:
    // new transports.File({ filename: 'logs/app.log' })
  ]
});

module.exports = logger;
