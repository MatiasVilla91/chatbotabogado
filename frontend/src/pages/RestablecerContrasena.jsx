import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import api from "../api"; // ✅ CORRECTO
import MainLayout from "../layouts/MainLayout";

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
        const res = await api.get(`/api/auth/reset-token/${token}`); // ✅ usa "/api/auth"
        setEmail(res.data.email);
      } catch (err) {
        setError("Token inválido o expirado");
      }
    };
    fetchEmail();
  }, [token]);

  const handleRestablecer = async () => {
    if (nueva !== confirmar) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, { password: nueva });// ✅ usa "/api/auth"
      setMensaje(res.data.message || "Contraseña actualizada con éxito");
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
