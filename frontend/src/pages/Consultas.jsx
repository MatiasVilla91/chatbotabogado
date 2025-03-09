import { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Importar el contexto de autenticación


function Consultas() {
  const { token } = useContext(AuthContext);
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setRespuesta("No tienes un token válido. Inicia sesión.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/legal/consulta",
        { pregunta },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRespuesta(response.data.respuesta);
    } catch (error) {
      setRespuesta("Error al obtener respuesta de la IA.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Tarjeta del formulario */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🏛️ Consultas Legales IA
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          Ingresa tu consulta legal y recibe asesoramiento inmediato.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Escribe tu consulta legal"
            multiline
            rows={4}
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ p: 1.5 }}>
            Enviar Consulta
          </Button>
        </Box>

        {/* Mostrar respuesta */}
        {respuesta && (
          <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: "#f4f6f8" }}>
            <Typography variant="h6">Respuesta de la IA:</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{respuesta}</Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default Consultas;
