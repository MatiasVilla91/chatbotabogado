// src/pages/Perfil.jsx
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Grid,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Mi Perfil
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 36,
                bgcolor: "#0a84ff",
              }}
            >
              {perfil.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {perfil.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "gray", mb: 1 }}>
              {perfil.email}
            </Typography>
            <Typography variant="body1">
              Estado del plan:{" "}
              <strong>{perfil.esPremium ? "Premium" : "Gratuito"}</strong>
            </Typography>
            <Typography variant="body1">
              Consultas restantes: <strong>{perfil.consultasRestantes}</strong>
            </Typography>
            <Typography variant="body1">
              Contratos restantes:{" "}
              <strong>{perfil.contratosRestantes}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
              Registrado el:{" "}
              {new Date(perfil.createdAt).toLocaleDateString("es-AR")}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Perfil;
