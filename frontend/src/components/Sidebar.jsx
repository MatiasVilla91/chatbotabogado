import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MenuIcon from "@mui/icons-material/Menu";
import HistoryIcon from "@mui/icons-material/History";
import GavelIcon from "@mui/icons-material/Gavel";
import LockIcon from "@mui/icons-material/Lock";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);
  const [conversaciones, setConversaciones] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchConversaciones = async () => {
    try {
      const response = await api.get("/legal/conversaciones");
      const lista = response.data?.conversaciones ?? [];
      setConversaciones(lista);
    } catch (error) {
      console.error("Error al obtener conversaciones:", error);
      setConversaciones([]);
    }
  };

  useEffect(() => {
    fetchConversaciones();
  }, [token]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const refresh = localStorage.getItem("refreshSidebar");
      if (refresh) {
        fetchConversaciones();
        localStorage.removeItem("refreshSidebar");
      }
    }, 1500);
    return () => clearInterval(intervalo);
  }, []);

 

  const navLegalItems = [
    { text: "Términos", icon: <GavelIcon />, to: "/terminos" },
    { text: "Privacidad", icon: <LockIcon />, to: "/privacidad" },
  ];

   const navItems = [
    { text: "Inicio", icon: <HomeIcon />, to: "/" },
    { text: "Características", icon: <InfoIcon />, to: "/caracteristicas" },
    { text: "Precios", icon: <MonetizationOnIcon />, to: "/precios" },
    //{ text: "Historial", icon: <HistoryIcon />, to: "/historial" },
  ];

  const renderNavLinks = (items) => (
    <>
      {items.map((item) => (
        <Tooltip title={item.text} placement="right" arrow key={item.text}>
          <Link
            to={item.to}
            style={{ textDecoration: "none", color: "#ccc" }}
            onClick={() => setOpen(false)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 1,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#2c2c2c",
                },
              }}
            >
              {item.icon}
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.text}
              </Typography>
            </Box>
          </Link>
        </Tooltip>
      ))}
    </>
  );

  const renderHistorial = () => (
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: "#888",
          mb: 1,
          fontSize: "0.75rem",
          textTransform: "uppercase",
        }}
      >
        Conversaciones
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: 2 }}>
        {conversaciones.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "#666", fontSize: "0.8rem" }}
          >
            Sin conversaciones aún.
          </Typography>
        ) : (
          conversaciones.map((c) => (
            <Link
              key={c._id}
              to={`/consultas?id=${c._id}`}
              onClick={() => setOpen(false)}
              style={{ textDecoration: "none", color: "#ccc" }}
            >
              <Box
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "#2c2c2c",
                    color: "#fff",
                  },
                }}
              >
                {c.titulo || "Sin título"}
              </Box>
            </Link>
          ))
        )}
      </Box>
    </Box>
  );

  const sidebarContent = (
    <Box
    sx={{
      width: 240,
      height: "120vh",
      backgroundColor: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      minHeight: "100vh",
    }}
  >
      {/* Parte superior */}
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: "bold", mb: 4 }}
        >
          DICTUM IA
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {renderNavLinks(navItems)}
        </Box>
      </Box>

      {/* Historial scrollable */}
     <Box
  sx={{
    flex: 1,
    overflowY: "auto",
    px: 3,
    pr: 1,
    minHeight: 0 // ⚠️ CLAVE para que el bloque inferior no se empuje hacia abajo
  }}
>
        {renderHistorial()}
      </Box>

      {/* Parte inferior fija */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #333",
        }}
      >
        <Box sx={{ mb: 1 }}>{renderNavLinks(navLegalItems)}</Box>
        <Link to="/planes" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              textAlign: "center",
              py: 1,
              backgroundColor: "#0a84ff",
              borderRadius: 2,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#0077e6",
              },
            }}
          >
            🌟 Mejorar plan
          </Box>
        </Link>
      </Box>
    </Box>
  );

  return isMobile ? (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          backgroundColor: "#1a1a1a",
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        <MenuIcon sx={{ color: "#fff" }} />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {sidebarContent}
      </Drawer>
    </>
  ) : (
    sidebarContent
  );
}

export default Sidebar;
