// src/pages/OlvideContrasena.jsx
import { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
//import axios from "axios";
import api from "../api";
import MainLayout from "../layouts/MainLayout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const OlvideContrasena = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleEnviar = async () => {
    try {
      const res = await api.post(`${backendUrl}/api/auth/forgot-password`, { email });

      setMensaje(res.data.message);
      setError("");
    } catch (err) {
      setMensaje("");
      setError(err.response?.data?.error || "Error al enviar correo");
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recuperar contraseña
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
          Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </Typography>
        <TextField
          label="Correo electrónico"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleEnviar}>
          Enviar enlace
        </Button>

        <Snackbar open={!!mensaje} autoHideDuration={4000} onClose={() => setMensaje("")}>
          <Alert severity="success">{mensaje}</Alert>
        </Snackbar>

        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default OlvideContrasena;
