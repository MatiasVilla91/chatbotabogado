import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AuthCard from "../components/AuthCard";
import GoogleIcon from "@mui/icons-material/Google";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return setSnackbar({ open: true, message: "Email inválido", severity: "warning" });
    }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      setSnackbar({ open: true, message: "✅ Registro exitoso. Verificá tu email.", severity: "success" });
      setShowResend(true); // ⬅️ ahora se puede reenviar si no le llegó
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || "Error al registrar";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!validateEmail(email)) {
      return setSnackbar({ open: true, message: "Ingresá un email válido", severity: "warning" });
    }

    try {
      await axios.post(`${backendUrl}/api/auth/resend-verification-email`, { email });
      setSnackbar({ open: true, message: "Correo reenviado. Revisá tu bandeja.", severity: "success" });
    } catch (err) {
      const msg = err.response?.data?.error || "Error al reenviar el correo";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  return (
    <AuthCard>
      <Typography variant="h4" align="center" sx={{ color: "#fff", fontWeight: "bold", mb: 3 }}>
        Crear Cuenta
      </Typography>
      <form onSubmit={handleRegister}>
        <TextField
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, height: 50 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : "Registrarse"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => window.location.href = `${backendUrl}/api/auth/google`}
        >
          <GoogleIcon sx={{ fontSize: 24, mr: 1 }} />
          Continuar con Google
        </Button>

        {showResend && (
          <Button onClick={handleResendEmail} sx={{ mt: 2 }}>
            Reenviar email de verificación
          </Button>
        )}

        <Typography align="center" variant="body2" sx={{ mt: 2, color: "#ccc" }}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={{ color: "#0a84ff", textDecoration: "none" }}>
            Iniciá sesión
          </Link>
        </Typography>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </AuthCard>
  );
}

export default Register;
