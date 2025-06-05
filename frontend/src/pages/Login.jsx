import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api";
import AuthCard from "../components/AuthCard";
import GoogleIcon from "@mui/icons-material/Google";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });

      login(response.data.token, response.data.user);
      localStorage.setItem("token", response.data.token);
      navigate("/consultas");
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      const mensaje = error.response?.data?.error || "Error al iniciar sesión";
      setSnackbar({ open: true, message: mensaje, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#fff", fontWeight: "bold", mb: 3 }}
      >
        Iniciar Sesión
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, height: 50 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : "Iniciar Sesión"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => window.location.href = `${backendUrl}/api/auth/google`}
          disabled={loading}
        >
          <GoogleIcon sx={{ fontSize: 24, mr: 1 }} />
          {loading ? <CircularProgress size={24} color="inherit" /> : "Continuar con Google"}
        </Button>

        <Typography align="center" variant="body2" sx={{ mt: 2, color: "#ccc" }}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={{ color: "#0a84ff", textDecoration: "none" }}>
            Registrate
          </Link>
        </Typography>

        <Typography align="center" variant="body2" sx={{ mt: 1.5, color: "#ccc" }}>
          <Link to="/olvide-contrasena" style={{ color: "#ccc", textDecoration: "none" }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </Typography>
      </form>

      {/* ✅ Snackbar de error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthCard>
  );
}

export default Login;
