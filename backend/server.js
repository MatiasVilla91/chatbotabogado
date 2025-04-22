require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Preference } = require("mercadopago");

const authRoutes = require('./routes/auth');
const legalRoutes = require('./routes/legal');
const contratosRoutes = require('./routes/contratos');
const upgradeRoutes = require('./routes/upgrade');
const usuarioRoutes = require('./routes/usuario');
const whatsappRoutes = require('./routes/whatsapp');
const adminRoutes = require('./routes/admin');
const { checkAuth } = require('./middleware/auth');
const logger = require('./utils/logger');


const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware para procesar formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// ✅ CORS para local y producción
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://drleyes.netlify.app',
    'http://localhost:3000', // 👈 nuevo (Vite o HTML local en server)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Configuración de MercadoPago
const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// ✅ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error en MongoDB:', err));

// ✅ Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/legal', checkAuth, legalRoutes);
app.use('/api/contratos', checkAuth, contratosRoutes);
app.use('/api/upgrade', upgradeRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// ✅ Ruta de administración
app.use('/admin', adminRoutes); // Protegido internamente con `soloAdmin`

// ✅ Crear preferencia de pago MercadoPago
app.post('/api/payment', async (req, res) => {
  const { description, price, quantity } = req.body;

  const preference = {
    items: [{
      title: description,
      unit_price: parseFloat(price),
      quantity: parseInt(quantity),
    }],
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

    res.status(200).json({
      init_point: response.sandbox_init_point || response.init_point
    });
  } catch (error) {
    console.error("❌ Error creando preferencia:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
});

// ✅ Ruta para verificar si el servidor está vivo
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Levantar el servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);

});
