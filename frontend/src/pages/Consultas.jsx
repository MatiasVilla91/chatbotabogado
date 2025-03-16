// Consultas.jsx - Rediseño Minimalista
import { useState, useContext, useEffect, useRef } from "react";
import { Container, TextField, IconButton, Typography, Box, Paper, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SyncLoader } from "react-spinners";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

function Consultas() {
  const { token } = useContext(AuthContext);
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "No tienes un token válido. Inicia sesión." }]);
      return;
    }

    setMensajes((prev) => [...prev, { tipo: "sent", texto: pregunta }]);
    setPregunta("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/consulta`,
        { pregunta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensajes((prev) => [...prev, { tipo: "received", texto: response.data.respuesta }]);
    } catch (error) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "Error al obtener respuesta de la IA." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#42a5f5', fontWeight: 'bold' }}>
        DICTUM IA
      </Typography>
      <Box sx={{ height: "60vh", overflowY: "auto", mb: 2, p: 2, backgroundColor: '#1e1e1e', borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
        {mensajes.map((msg, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              padding: '0.8em 1em',
              borderRadius: '12px',
              marginBottom: '0.5em',
              wordBreak: 'break-word',
              textAlign: msg.tipo === "sent" ? "right" : "left",
              backgroundColor: msg.tipo === "sent" ? '#2e2e2e' : '#0d6efd',
              color: msg.tipo === "sent" ? '#fff' : '#fff',
              transition: 'background-color 0.3s ease'
            }}
          >
            {msg.texto}
          </Typography>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <SyncLoader color="#0d6efd" size={10} />
          </Box>
        )}

        <div ref={chatEndRef} />
      </Box>

      <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, borderRadius: '12px', backgroundColor: '#1a1a1a', boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }} autoComplete="off">
        <TextField
          fullWidth
          placeholder="Escribe tu consulta legal..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          variant="outlined"
          sx={{ borderRadius: '12px', backgroundColor: '#2e2e2e', color: '#fff', input: { color: '#fff' } }}
        />
        <IconButton type="submit" color="primary" sx={{ backgroundColor: '#0d6efd', '&:hover': { backgroundColor: '#0b5ed7' }, borderRadius: '50%' }}>
          <SendIcon sx={{ color: '#fff' }} />
        </IconButton>
      </Paper>

      <Button 
        variant="contained" 
        color="secondary" 
        fullWidth 
        sx={{ mt: 3, backgroundColor: '#212121', '&:hover': { backgroundColor: '#424242' } }}
        onClick={handlePayment}
      >
        Pagar con MercadoPago
      </Button>
    </Container>
  );
}

export default Consultas;
