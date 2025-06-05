import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress, Button, TextField } from "@mui/material";

const VerificarCuenta = () => {
  const { token } = useParams();
  const [estado, setEstado] = useState("verificando");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const ejecutado = useRef(false); // 🔒 evita ejecución doble en desarrollo

  useEffect(() => {
    const verificar = async () => {
      console.log("📦 Token recibido:", token);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email/${token}`);
        console.log("✅ Respuesta backend:", res.data);
        setEstado("ok");
      } catch (err) {
        console.error("❌ Error al verificar:", err.response?.data || err.message);
        setEstado("error");
      }
    };

    if (!ejecutado.current) {
      ejecutado.current = true;
      verificar();
    }
  }, [token]);

  const reenviar = async () => {
    if (!email || !email.includes("@")) {
      setMensaje("Ingresá un email válido");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification-email`, { email });
      setMensaje(res.data.message || "Correo enviado");
    } catch (err) {
      setMensaje(err.response?.data?.error || "Error al reenviar");
    }
  };

  if (estado === "verificando") {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Verificando tu cuenta...</Typography>
      </Box>
    );
  }

  if (estado === "ok") {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" color="primary">✅ Cuenta verificada con éxito</Typography>
        <Button variant="contained" color="primary" href="/login" sx={{ mt: 4 }}>
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error">❌ El enlace ya expiró o no es válido</Typography>
      <Box mt={4}>
        <Typography>¿Querés que te reenviemos el correo de verificación?</Typography>
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          size="small"
          sx={{ mt: 2 }}
        />
        <Button onClick={reenviar} variant="contained" color="primary" sx={{ mt: 2 }}>
          Reenviar email
        </Button>
        {mensaje && (
          <Typography mt={2} color="secondary">{mensaje}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default VerificarCuenta;
