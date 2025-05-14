// Consultas.jsx - Layout profesional estilo GPT
import { useSearchParams } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  Modal,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
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
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    if (chatId && token) {
      const fetchConversacion = async () => {
        try {
          const res = await axios.get(`${backendUrl}/api/legal/conversacion/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMensajes(res.data.mensajes || []);
        } catch (error) {
          console.error("❌ Error al cargar la conversación:", error);
        }
      };
      fetchConversacion();
    }
  }, [chatId, token]);

  useEffect(() => {
    localStorage.setItem("chatLegal", JSON.stringify(mensajes));
  }, [mensajes]);

  useEffect(() => {
    const fetchEstado = async () => {
      const response = await axios.get(`${backendUrl}/api/usuario/estado-plan`, {
        headers: { Authorization: `Bearer ${token}` },
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

    const initPoint = response.data.init_point;

    if (initPoint) {
      window.location.href = initPoint;
    } else {
      alert("❌ El backend respondió pero no envió un link válido para pagar.");
    }
  } catch (error) {
    const mensaje =
      error?.response?.data?.error ||
      error?.message ||
      "Error desconocido al intentar generar el link de pago.";

    alert("❌ Error al iniciar el pago:\n" + mensaje);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "No tienes un token válido. Iniciá sesión." }]);
      return;
    }

    const horaEnvio = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nuevaEntrada = { tipo: "sent", texto: pregunta, hora: horaEnvio };

    const historialParaEnviar = [
      ...mensajes
        .filter((m) => m.tipo === "sent" || m.tipo === "received")
        .map((m) => ({
          role: m.tipo === "sent" ? "user" : "assistant",
          content: m.texto,
        })),
      { role: "user", content: pregunta },
    ];

    setMensajes((prev) => [...prev, nuevaEntrada]);
    setPregunta("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/consulta`,
        { pregunta, historial: historialParaEnviar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const horaRespuesta = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const mensajeIA = response.data.respuesta;

      setIsTyping(false);
      setMensajes((prev) => [...prev, { tipo: "received", texto: mensajeIA, hora: horaRespuesta }]);
      localStorage.setItem("refreshSidebar", Date.now());
    } catch (error) {
      const is403 = error?.response?.status === 403;
      setIsTyping(false);
      setMensajes((prev) => [
        ...prev,
        {
          tipo: "received",
          texto: is403
            ? error.response.data.message || "Tu plan gratuito ha terminado. Actualizá a Premium para continuar."
            : "Error al obtener respuesta de la IA.",
        },
      ]);
      if (is403) setMostrarModal(true);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "90vh", overflow: "hidden" }}>

      {/* CONTENIDO PRINCIPAL - RESPETA ESPACIO DE SIDEBAR */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#111" }}>
        {/* ENCABEZADO */}
        <Box sx={{ px: isMobile ? 2 : 6, pt: 4, pb: 1 }}>
          <Typography variant="h4" align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
            Dictum IA
          </Typography>
          {plan && (
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 1, color: plan.esPremium ? "#81c784" : "#ccc" }}
            >
              {plan.esPremium
                ? "🌟 Estás usando una cuenta Premium sin límites."
                : `💬 Consultas restantes: ${plan.consultasRestantes} | 📄 Contratos restantes: ${plan.contratosRestantes}`}
            </Typography>
          )}
        </Box>

        {/* MENSAJES */}
        <Box sx={{ flex: 1, overflowY: "auto", px: isMobile ? 2 : 6, py: 2 }}>
          <AnimatePresence>
            {mensajes.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: "#999", mb: 0.5 }}>
                    {msg.tipo === "sent" ? "👤 Usuario" : "⚖️ Dictum IA"} – {msg.hora || ""}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: msg.tipo === "sent" ? "#2e2e2e" : "#1e1e1e",
                      color: "#fff",
                      p: 2,
                      borderRadius: 2,
                      textAlign: msg.tipo === "sent" ? "right" : "left",
                      border: msg.tipo === "received" ? "1px solid #444" : "none",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Typography variant="body1">{msg.texto}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "#999", mb: 0.5 }}>
                  ⚖️ Dictum IA – escribiendo...
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    p: 2,
                    borderRadius: 2,
                    textAlign: "left",
                    border: "1px solid #444",
                  }}
                >
                  <Typography variant="body1">...</Typography>
                </Box>
              </Box>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </Box>

        {/* INPUT DE CONSULTA */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ px: isMobile ? 2 : 6, py: 2, borderTop: "1px solid #222", backgroundColor: "#111" }}
        >
          <TextField
            fullWidth
            placeholder="Escribí tu consulta legal..."
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            sx={{ input: { color: "#fff" }, backgroundColor: "#1a1a1a", borderRadius: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    sx={{
                      backgroundColor: "#0a84ff",
                      "&:hover": { backgroundColor: "#006fdd" },
                      p: 1,
                      borderRadius: 2,
                    }}
                  >
                    <SendIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* BOTÓN DE PAGO */}
        <Box sx={{ px: isMobile ? 2 : 6, pb: 2 }}>
          <Button fullWidth onClick={handlePayment} variant="contained" sx={{ backgroundColor: "#333", "&:hover": { backgroundColor: "#444" } }}>
            Pagar con MercadoPago
          </Button>
        </Box>
      </Box>

      {/* MODAL DE PAGO */}
      <Modal open={mostrarModal} onClose={() => setMostrarModal(false)}>
        <Box
          sx={{
            width: 400,
            mx: "auto",
            mt: "20vh",
            p: 4,
            bgcolor: "#1e1e1e",
            color: "#fff",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            ⚖️ ¡Tu plan gratuito ha terminado!
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Para seguir usando la IA legal, actualizá a una cuenta Premium y obtené acceso ilimitado a consultas y contratos.
          </Typography>
          <Button variant="contained" fullWidth onClick={handlePayment}>
            Actualizar a Premium
          </Button>
          <Button variant="text" fullWidth onClick={() => setMostrarModal(false)} sx={{ mt: 1, color: "#ccc" }}>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Consultas;
