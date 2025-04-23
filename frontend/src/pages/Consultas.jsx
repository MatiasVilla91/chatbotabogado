// Consultas.jsx - Con animación GPT-like y typing effect
import { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  Modal,
  useMediaQuery,
  InputAdornment
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { SyncLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Consultas() {
  const [plan, setPlan] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { token } = useContext(AuthContext);
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    const saved = localStorage.getItem('chatLegal');
    if (saved) setMensajes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatLegal', JSON.stringify(mensajes));
  }, [mensajes]);

  useEffect(() => {
    const fetchEstado = async () => {
      const response = await axios.get(`${backendUrl}/api/usuario/estado-plan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan(response.data);
    };
    fetchEstado();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/payment`, {
        description: "Asesoría Legal IA",
        price: 1000,
        quantity: 1,
      });
      window.location.href = response.data.init_point;
    } catch (error) {
      console.error("❌ Error al iniciar el pago:", error.response ? error.response.data : error.message);
      alert("Error al iniciar el pago, revisa la consola para más detalles.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "No tienes un token válido. Inicia sesión." }]);
      return;
    }

    const horaEnvio = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nuevaEntrada = { tipo: "sent", texto: pregunta, hora: horaEnvio };

    const historialParaEnviar = [
      ...mensajes.filter(m => m.tipo === "sent" || m.tipo === "received")
        .map(m => ({ role: m.tipo === "sent" ? "user" : "assistant", content: m.texto })),
      { role: "user", content: pregunta }
    ];

    setMensajes((prev) => [...prev, nuevaEntrada]);
    setPregunta("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/consulta`,
        { pregunta, historial: historialParaEnviar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const horaRespuesta = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const mensajeIA = response.data.respuesta;

      setMensajes((prev) => [...prev, { tipo: "received", texto: mensajeIA, hora: horaRespuesta }]);

      await axios.post(`${backendUrl}/api/legal/guardar-chat`, 
        { mensajes: [...mensajes, { tipo: "received", texto: mensajeIA, hora: horaRespuesta }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    } catch (error) {
      const is403 = error?.response?.status === 403;
      setMensajes((prev) => [...prev, {
        tipo: "received",
        texto: is403 ? (error.response.data.message || "Tu plan gratuito ha terminado. Actualizá a Premium para continuar.") : "Error al obtener respuesta de la IA."
      }]);
      if (is403) setMostrarModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#111" }}>
      <Box sx={{ px: isMobile ? 2 : 6, pt: 4, pb: 1 }}>
        <Typography variant="h4" align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Dictum IA
        </Typography>
        {plan && (
          <Typography variant="body2" align="center" sx={{ mt: 1, color: plan.esPremium ? '#81c784' : '#ccc' }}>
            {plan.esPremium ? '🌟 Estás usando una cuenta Premium sin límites.' : `💬 Consultas restantes: ${plan.consultasRestantes} | 📄 Contratos restantes: ${plan.contratosRestantes}`}
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: isMobile ? 2 : 6, py: 2 }}>
        <AnimatePresence>
          {mensajes.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "#999", mb: 0.5 }}>
                  {msg.tipo === "sent" ? "👤 Usuario" : "⚖️ Dictum IA"} – {msg.hora || ""}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: msg.tipo === "sent" ? '#2e2e2e' : '#0a84ff',
                    color: '#fff',
                    p: 2,
                    borderRadius: 2,
                    textAlign: msg.tipo === "sent" ? "right" : "left",
                    maxWidth: "100%",
                  }}
                >
                  <Typography variant="body1">{msg.texto}</Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography variant="body2" color="#ccc">Dictum IA está escribiendo...</Typography>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          px: isMobile ? 2 : 6,
          py: 2,
          backgroundColor: '#111',
          borderTop: '1px solid #222'
        }}
      >
        <TextField
          fullWidth
          placeholder="Escribí tu consulta legal..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          sx={{ input: { color: '#fff' }, backgroundColor: '#1a1a1a', borderRadius: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" sx={{ backgroundColor: '#0a84ff', '&:hover': { backgroundColor: '#006fdd' }, p: 1, borderRadius: 2 }}>
                  <SendIcon sx={{ color: '#fff' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box sx={{ px: isMobile ? 2 : 6, pb: 2 }}>
        <Button fullWidth onClick={handlePayment} variant="contained" sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#444' } }}>
          Pagar con MercadoPago
        </Button>
      </Box>

      <Modal open={mostrarModal} onClose={() => setMostrarModal(false)}>
        <Box sx={{ width: 400, mx: 'auto', mt: '20vh', p: 4, bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            ⚖️ ¡Tu plan gratuito ha terminado!
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Para seguir usando la IA legal, actualizá a una cuenta Premium y obtené acceso ilimitado a consultas y contratos.
          </Typography>
          <Button variant="contained" fullWidth onClick={handlePayment}>
            Actualizar a Premium
          </Button>
          <Button variant="text" fullWidth onClick={() => setMostrarModal(false)} sx={{ mt: 1, color: '#ccc' }}>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Consultas;