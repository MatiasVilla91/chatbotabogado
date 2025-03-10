import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("✅ Backend URL:", backendUrl);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      login(response.data.token);
      navigate("/consultas");
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert("Error al iniciar sesión");
    }
  };
  

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Iniciar Sesión
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
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
          Iniciar Sesión
        </Button>
      </form>
    </Container>
  );
}

export default Login;
