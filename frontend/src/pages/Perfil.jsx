// src/pages/Perfil.jsx
import { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

console.log("👀 Perfil renderizado correctamente");

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/usuario/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerfil(res.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!perfil) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          No se pudo cargar el perfil.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
      }}
    >
      
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Mi Perfil
      </Typography>

      <Paper
  elevation={0}
  sx={{
    p: 4,
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: 4,
    maxWidth: "600px",
    mx: "auto",
  }}
  
>
  
  <Avatar
    sx={{
      width: 100,
      height: 100,
      fontSize: 40,
      bgcolor: "#0a84ff",
      boxShadow: "0 0 20px rgba(10,132,255,0.4)",
    }}
  >
    {perfil.name?.charAt(0).toUpperCase()}
  </Avatar>
  




  <Box>
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
      {perfil.name}
    </Typography>
    <Typography variant="body2" sx={{ color: "#ccc", mb: 2 }}>
      {perfil.email}
    </Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Estado del plan:{" "}
      <strong style={{ color: "#fff" }}>
        {perfil.esPremium ? "Premium" : "Gratuito"}
      </strong>
    </Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Consultas restantes:{" "}
      <strong style={{ color: "#fff" }}>{perfil.consultasRestantes}</strong>
    </Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Contratos restantes:{" "}
      <strong style={{ color: "#fff" }}>{perfil.contratosRestantes}</strong>
    </Typography>
    <Typography variant="body2" sx={{ mt: 2, color: "#aaa" }}>
      Registrado el:{" "}
      {new Date(perfil.createdAt).toLocaleDateString("es-AR")}
    </Typography>
    
  </Box>
 
</Paper>

    
    </Box>
  );
};

export default Perfil;
