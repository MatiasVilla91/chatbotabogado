import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography } from "@mui/material";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert("✅ Registro exitoso");
    } catch (error) {
      console.error("❌ Error en el registro:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Registrarse
      </Typography>
      <form onSubmit={handleRegister} style={{ marginTop: "20px" }}>
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
        <Button type="submit" variant="contained" color="primary">
          Registrarse
        </Button>
      </form>
    </Container>
  );
}

export default Register;
