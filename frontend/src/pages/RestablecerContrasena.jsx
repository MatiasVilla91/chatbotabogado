import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RestablecerContrasena = () => {
  const { token } = useParams();
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await axios.get(`${backendUrl}/auth/reset-token/${token}`);
        setEmail(res.data.email);
      } catch (err) {
        setError("Token inválido o expirado");
      }
    };
    fetchEmail();
  }, [token]);

  const handleRestablecer = async () => {
    if (nueva !== confirmar) return setError("Las contraseñas no coinciden");
    try {
      const res = await axios.post(`${backendUrl}/auth/reset-password/${token}`, { nueva });
      setMensaje(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar contraseña");
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Establecer nueva contraseña
        </Typography>
        {email && (
          <Typography variant="body1" gutterBottom>
            Estás restableciendo la contraseña de: <strong>{email}</strong>
          </Typography>
        )}
        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleRestablecer}>
          Restablecer
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

export default RestablecerContrasena;
