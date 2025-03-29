// Consultas.jsx - Rediseño Minimalista
import { useState, useContext, useEffect, useRef } from "react";
import { Container, TextField, IconButton, Typography, Box, Paper, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SyncLoader } from "react-spinners";
import { Modal } from "@mui/material";



const backendUrl = import.meta.env.VITE_BACKEND_URL;



function Consultas() {  
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

  const [plan, setPlan] = useState(null); // 👈 para guardar esPremium y los créditos restantes
  const [mostrarModal, setMostrarModal] = useState(false);
  const { token } = useContext(AuthContext);
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  //enviar y guardar en bd

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "No tienes un token válido. Inicia sesión." }]);
      return;
    }
  
    const horaEnvio = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nuevaEntrada = { tipo: "sent", texto: pregunta, hora: horaEnvio };
  
    const historialParaEnviar = [
      ...mensajes
        .filter(m => m.tipo === "sent" || m.tipo === "received")
        .map(m => ({
          role: m.tipo === "sent" ? "user" : "assistant",
          content: m.texto
        })),
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
  
      // 💾 Guardar chat solo si hay respuesta válida
      await axios.post(`${backendUrl}/api/legal/guardar-chat`, 
        { mensajes: [...mensajes, { tipo: "received", texto: mensajeIA, hora: horaRespuesta }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
    } catch (error) {
      const is403 = error?.response?.status === 403;
  setMensajes((prev) => [
    ...prev,
    {
      tipo: "received",
      texto: is403
        ? error.response.data.message || "Tu plan gratuito ha terminado. Actualizá a Premium para continuar."
        : "Error al obtener respuesta de la IA."
    }
  ]);

  if (is403) setMostrarModal(true);
}

  

  // Cargar historial desde localStorage al iniciar
useEffect(() => {
  const saved = localStorage.getItem('chatLegal');
  if (saved) setMensajes(JSON.parse(saved));
}, []);

// Guardar historial cada vez que cambia
useEffect(() => {
  localStorage.setItem('chatLegal', JSON.stringify(mensajes));
}, [mensajes]);


//MOSTRAR CANTIDAD DE PREGUNTAS FREE
useEffect(() => {
  const fetchEstado = async () => {
    const response = await axios.get(`${backendUrl}/api/usuario/estado-plan`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPlan(response.data);
  };
  fetchEstado();
}, []); } 

  

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {plan && !plan.esPremium && (
  <Typography variant="body2" align="center" sx={{ mb: 2, color: '#ccc' }}>
    💬 Consultas restantes: <strong>{plan.consultasRestantes}</strong> &nbsp;&nbsp;|&nbsp;&nbsp; 
    📄 Contratos restantes: <strong>{plan.contratosRestantes}</strong>
  </Typography>
)}

{plan && plan.esPremium && (
  <Typography variant="body2" align="center" sx={{ mb: 2, color: '#81c784' }}>
    🌟 Estás usando una cuenta Premium sin límites.
  </Typography>
)}

      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#42a5f5', fontWeight: 'bold' }}>

        DICTUM IA
      </Typography>
      <Box sx={{ height: "60vh", overflowY: "auto", mb: 2, p: 2, backgroundColor: '#1e1e1e', borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
        {mensajes.map((msg, index) => (
          <Box key={index} sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            align={msg.tipo === "sent" ? "right" : "left"}
            display="block"
            sx={{ color: "#aaa", fontSize: "0.75rem", mb: 0.5 }}
          >
            {msg.tipo === "sent" ? "👤 Usuario" : "⚖️ Dictum IA"} – {msg.hora}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              padding: '0.8em 1em',
              borderRadius: '12px',
              marginBottom: '0.5em',
              wordBreak: 'break-word',
              textAlign: msg.tipo === "sent" ? "right" : "left",
              backgroundColor: msg.tipo === "sent" ? '#2e2e2e' : '#0d6efd',
              color: '#fff',
              transition: 'background-color 0.3s ease'
            }}
          >
            {msg.texto}
          </Typography>
        </Box>
        
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

        {/*MODAL PARA PAGO*/}
      <Modal open={mostrarModal} onClose={() => setMostrarModal(false)}>
  <Box sx={{
    width: 400,
    mx: 'auto',
    mt: '20vh',
    p: 4,
    bgcolor: '#1e1e1e',
    color: '#fff',
    borderRadius: 2,
    boxShadow: 24,
    textAlign: 'center'
  }}>
    <Typography variant="h6" gutterBottom>
      ⚖️ ¡Tu plan gratuito ha terminado!
    </Typography>
    <Typography variant="body2" sx={{ mb: 3 }}>
      Para seguir usando la IA legal, actualizá a una cuenta Premium y obtené acceso ilimitado a consultas y contratos.
    </Typography>
    <Button
      variant="contained"
      fullWidth
      onClick={handlePayment}
      sx={{ backgroundColor: '#0d6efd', '&:hover': { backgroundColor: '#0b5ed7' } }}
    >
      Actualizar a Premium
    </Button>
    <Button
      variant="text"
      fullWidth
      onClick={() => setMostrarModal(false)}
      sx={{ mt: 1, color: '#ccc' }}
    >
      Cancelar
    </Button>
  </Box>
</Modal>


    </Container>
    
    
  );
}

export default Consultas;
