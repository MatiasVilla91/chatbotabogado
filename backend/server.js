// legal_ai_backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const legalRoutes = require('./routes/legal');
const { checkAuth } = require('./middleware/auth');

// Cargar variables de entorno según el entorno
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});



// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());


// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB')).catch(err => console.log('❌ Error en MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/legal', checkAuth, legalRoutes);

// Servidor corriendo
//app.listen(PORT, () => {
  //console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}:${HOST}`);
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

