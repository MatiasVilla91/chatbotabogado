import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PerfilCardWrapper from "../components/PerfilCardWrapper"; // 👈 nuevo contenedor exclusivo

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        py: 6,
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#fff",
        }}
      >
        Mi Perfil
      </Typography>

      <PerfilCardWrapper>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          {/* Avatar a la izquierda */}
          <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: { xs: 120, md: 200 },
    height: { xs: 120, md: 200 },
    pr: { xs: 0, md: 4 },
    mb: { xs: 3, md: 0 },
  }}
>
  <Avatar
    sx={{
      width: "100%",
      height: "100%",
      fontSize: { xs: 40, md: 80 },
      bgcolor: "#0a84ff",
      boxShadow: "0 0 20px rgba(10,132,255,0.4)",
    }}
  >
    {perfil.name?.charAt(0).toUpperCase()}
  </Avatar>
</Box>



          {/* Información del usuario */}
          <Box sx={{ minWidth: 250 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {perfil.name}
            </Typography>

            <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
              {perfil.email}
            </Typography>

            <Divider sx={{ my: 1.5, backgroundColor: "#333" }} />

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Estado del plan:</strong>{" "}
              {perfil.esPremium ? "✨ Premium" : "Gratuito"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: perfil.consultasRestantes < 0 ? "#f44336" : "#fff",
              }}
            >
              <strong>Consultas restantes:</strong> {perfil.consultasRestantes}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Contratos restantes:</strong> {perfil.contratosRestantes}
            </Typography>

            <Typography variant="body2" sx={{ color: "gray", mt: 2 }}>
              Registrado el:{" "}
              {new Date(perfil.createdAt).toLocaleDateString("es-AR")}
            </Typography>
          </Box>
        </Box>
      </PerfilCardWrapper>
    </Box>
  );
};

export default Perfil;
