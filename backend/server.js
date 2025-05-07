require('dotenv').config();
require('./config/passport');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Preference } = require("mercadopago");
const mongoSanitize = require('express-mongo-sanitize');



// Google Auth
const passport = require('passport');
require('./config/passport');
const session = require('express-session');

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








// ✅ Configuración de sesiones y Passport (ANTES DE LAS RUTAS)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo seguro en producción
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}));

app.use(passport.initialize());
app.use(passport.session());





// ✅ CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://drleyes.netlify.app',
    'https://chatbotabogado.onrender.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));



// ✅ Middleware global
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(mongoSanitize());
app.use('/api/auth', require('./routes/auth'));




// ✅ MercadoPago
const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error en MongoDB:', err));



// ✅ Rutas
app.use('/api/auth', authRoutes);
app.use('/api/legal', checkAuth, legalRoutes);
app.use('/api/contratos', checkAuth, contratosRoutes);
app.use('/api/upgrade', upgradeRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/admin', adminRoutes);

// ✅ MercadoPago
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

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
});




const jwt = require("jsonwebtoken");

