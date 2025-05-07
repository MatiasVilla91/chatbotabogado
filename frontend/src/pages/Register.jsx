import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  CircularProgress // ⬅️ spinner
} from "@mui/material";
import AuthCard from "../components/AuthCard"; // ✅ importamos el nuevo layout
import GoogleIcon from "@mui/icons-material/Google"; // ✅ Usamos el icono de Google directamente de Material UI


const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ acá debe ir el useState

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert("✅ Registro exitoso");
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <AuthCard>
      <Typography variant="h4" align="center" sx={{ color: '#ffff', fontWeight: 'bold', mb: 3 }}>
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
          sx={{ mt: 1, height:50 }}
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
  <GoogleIcon sx={{ fontSize: 24 }} /> 
  {loading ? <CircularProgress size={28} color="inherit" /> : ""}
  
</Button>


        <Typography align="center" variant="body2" sx={{ mt: 2, color: '#ccc' }}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={{ color: "#0a84ff", textDecoration: "none" }}>
            Iniciá sesión
          </Link>
        </Typography>
      </form>
    </AuthCard>
  );
}

export default Register;
