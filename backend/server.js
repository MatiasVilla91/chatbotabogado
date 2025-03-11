// legal_ai_backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const legalRoutes = require('./routes/legal');
const { checkAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// ✅ CORS para local y producción
const corsOptions = {
  origin: [
    'http://localhost:5173', // Localhost en desarrollo
    'https://drleyes.netlify.app' // Producción en Netlify
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

const User = require('./models/User');

mongoose.connection.once('open', async () => {
    const user = await User.findOne({ email: "tuemail@example.com" });
    console.log("🔍 Usuario encontrado:", user);
});


// ✅ Middleware
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error en MongoDB:', err));

// ✅ Rutas
app.use('/api/auth', authRoutes);
app.use('/api/legal', checkAuth, legalRoutes);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Levantar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
