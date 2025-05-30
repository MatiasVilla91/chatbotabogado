require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const passport = require('passport');
const logger = require('./utils/logger');
const mercadopago = require("mercadopago");

const authRoutes = require('./routes/auth');
const legalRoutes = require('./routes/legal');
const contratosRoutes = require('./routes/contratos');
const upgradeRoutes = require('./routes/upgrade');
const usuarioRoutes = require('./routes/usuario');
const whatsappRoutes = require('./routes/whatsapp');
const adminRoutes = require('./routes/admin');
const verificarPlan = require('./middleware/verificarPlan');
const { checkAuth } = require('./middleware/auth');

require('./config/passport');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// ✅ Webhook Telegram (después de definir `app`)
const bot = require('./routes/telegram');
if (process.env.NODE_ENV === 'production') {
  app.use(express.json()); // necesario para procesar el body del webhook
  app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
}

//webhook MercadoPago

app.post('/webhook', express.json(), async (req, res) => {
  try {
    const payment = req.body;

    console.log("💰 Webhook recibido:", payment);

    // Si el pago fue aprobado
    if (payment?.data?.id && payment.type === 'payment') {
      const mpPayment = await mercadopago.payment.findById(payment.data.id);
      const estado = mpPayment.body.status;
const userId = mpPayment.body.metadata?.userId;

if (estado === 'approved' && userId) {
  await User.findByIdAndUpdate(
    userId,

          {
            esPremium: true,
            consultasRestantes: 9999,
            contratosRestantes: 9999,
            fechaInicioPremium: new Date(),
            fechaFinPremium: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          }
        );
        console.log("🎉 Usuario actualizado a premium:", userId);

      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.sendStatus(500);
  }
});


// ✅ Configuración de sesión y Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
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
app.use(mongoSanitize());

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log('❌ Error en MongoDB:', err));

// ✅ Configuración MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// ✅ Ruta de pago
app.post('/pago', async (req, res) => {
  try {
    const { description, price, quantity, userEmail, userId } = req.body;
    if (!description || !price || !quantity || !userEmail || !userId) {
  return res.status(400).json({ error: "Faltan campos obligatorios" });
}


    const preference = {
  items: [{ title: description, unit_price: parseFloat(price), quantity: parseInt(quantity) }],
  back_urls: {
    success: "https://drleyes.netlify.app/success",
    failure: "https://drleyes.netlify.app/failure",
    pending: "https://drleyes.netlify.app/pending",
  },
  auto_return: "approved",
  notification_url: "https://chatbotabogado.onrender.com/webhook",

  payer: {
    email: userEmail,
  },
  metadata: {
    userId: userId,
    userEmail: userEmail,
  }
};


    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ init_point: response.body.init_point });

  } catch (error) {
    console.error("❌ Error creando preferencia:", error.response?.data || error.message);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
});


// ✅ Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/legal', checkAuth, legalRoutes);
app.use('/api/contratos', checkAuth, contratosRoutes);
app.use('/api/upgrade', upgradeRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/admin', adminRoutes);
app.use('/api', checkAuth, verificarPlan);


// ✅ Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

// Opcional: si usás JWT en algún lado
const jwt = require("jsonwebtoken");
