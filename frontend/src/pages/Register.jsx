import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography
} from "@mui/material";
import AuthCard from "../components/AuthCard"; // ✅ importamos el nuevo layout

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
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
    }
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
          onChange={(ea) => setName(e.target.value)}
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
          sx={{ mt: 1 }}
        >
          Registrarse
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
