import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import AuthCard from "../components/AuthCard"; // ✅ Usamos el mismo layout

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state agregado
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Activamos el loading
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });
      console.log("🧠 Datos que llegan del backend:", response.data);

      login(response.data.token, response.data.user);
      navigate("/consultas");
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false); // ✅ Desactivamos el loading
    }
  };

  return (
    <AuthCard>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() =>
          window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`
        }
        disabled={loading} // ✅ Deshabilitamos si está cargando
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar sesión con Google"}
      </Button>

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
          disabled={loading} // ✅ Deshabilitamos si está cargando
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading} // ✅ Deshabilitamos si está cargando
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, height: 50 }}
          disabled={loading} // ✅ Deshabilitamos si está cargando
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : "Iniciar Sesión"}
        </Button>
        <Typography align="center" variant="body2" sx={{ mt: 2, color: "#ccc" }}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={{ color: "#0a84ff", textDecoration: "none" }}>
            Registrate
          </Link>
        </Typography>
      </form>
    </AuthCard>
  );
}

export default Login;
