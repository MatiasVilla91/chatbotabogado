import { useState, useContext, useEffect, useRef } from "react";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Consultas() {
  const { token } = useContext(AuthContext);
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
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

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/consulta`,
        { pregunta },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensajes((prev) => [...prev, { tipo: "received", texto: response.data.respuesta }]);
    } catch (error) {
      setMensajes((prev) => [...prev, { tipo: "received", texto: "Error al obtener respuesta de la IA." }]);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🏛️ Consultas Legales IA
      </Typography>
      <Box sx={{ height: "60vh", overflowY: "auto", mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
        {mensajes.map((msg, index) => (
          <Typography key={index} variant="body1" className={msg.tipo}>
            {msg.texto}
          </Typography>
        ))}
        <div ref={chatEndRef} />
      </Box>

      <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 2, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Escribe tu consulta legal..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
      </Paper>
    </Container>
  );
}

export default Consultas;
