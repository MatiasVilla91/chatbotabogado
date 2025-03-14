require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const legalRoutes = require('./routes/legal');
const { checkAuth } = require('./middleware/auth');
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Configuración de MercadoPago con el Access Token
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// ✅ CORS para local y producción
const corsOptions = {
  origin: [
    'http://localhost:5173', // Localhost en desarrollo
    'https://drleyes.netlify.app' // Producción en Netlify
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

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

// ✅ Ruta para crear la preferencia de pago
app.post('/api/payment', async (req, res) => {
  const { description, price, quantity } = req.body;

  const preference = {
    items: [
      {
        title: description,
        unit_price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    ],
    back_urls: {
      success: "https://drleyes.netlify.app/success",
      failure: "https://drleyes.netlify.app/failure",
      pending: "https://drleyes.netlify.app/pending",
    },
    auto_return: "approved",
  };

  try {
    const preferenceClient = new Preference(mercadopago);
    const response = await preferenceClient.create({ body: preference });

    res.status(200).json({ init_point: response.sandbox_init_point || response.init_point });

  } catch (error) {
    console.error("❌ Error creando preferencia:", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor",
    });
  }
});

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Levantar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
