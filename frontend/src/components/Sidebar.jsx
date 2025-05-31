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
import GavelIcon from "@mui/icons-material/Gavel";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { AuthContext } from "../context/AuthContext";




function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);
  const [conversaciones, setConversaciones] = useState([]);
  const { token } = useContext(AuthContext);
  // ✅ En Sidebar.jsx
  const [loading, setLoading] = useState(false);

  

  // ✅ Cargar conversaciones siempre que se abra el menú
  const fetchConversaciones = async () => {
    if (!token) {
      console.warn("🚨 Token no encontrado, no se cargan conversaciones.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/api/legal/conversaciones", {


        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.conversaciones) {
        setConversaciones(response.data.conversaciones);
        console.log("✅ Conversaciones cargadas:", response.data.conversaciones);
      } else {
        console.warn("🚨 No se encontraron conversaciones.");
        setConversaciones([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener conversaciones:", error);
      setError("Error al obtener conversaciones. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchConversaciones();
    }
  }, [token]);

  
 // ✅ Eliminar conversación
const deleteConversation = async (id) => {
  try {
    await api.delete(`/api/legal/conversaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Volvemos a cargar las conversaciones después de eliminar
    setConversaciones((prevConversaciones) =>
      prevConversaciones.filter((c) => c._id !== id)
    );
    console.log(`✅ Conversación ${id} eliminada correctamente.`);
  } catch (error) {
    console.error("❌ Error al eliminar conversación:", error);
    alert("Error al eliminar la conversación. Intenta nuevamente.");
  }
};


  // ✅ Navegación
  const navItems = [
    { text: "Inicio", icon: <HomeIcon />, to: "/" },
    { text: "Características", icon: <InfoIcon />, to: "/caracteristicas" },
    { text: "Precios", icon: <MonetizationOnIcon />, to: "/precios" },
  ];

  const navLegalItems = [
    { text: "Términos", icon: <GavelIcon />, to: "/terminos" },
    { text: "Privacidad", icon: <LockIcon />, to: "/privacidad" },
  ];

  // ✅ Renderizar historial
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
          <Typography variant="body2" sx={{ color: "#667", fontSize: "0.8rem" }}>
            Sin conversaciones aún.
          </Typography>
        ) : (
          <AnimatePresence>
            {conversaciones.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "#2c2c2c",
                      color: "#fff",
                    },
                  }}
                >
                  <Link
                    to={`/consultas?id=${c._id}`}
                    onClick={() => setOpen(false)}
                    style={{ textDecoration: "none", color: "#ccc", flex: 1 }}
                  >
                    {c.titulo || "Sin título"}
                  </Link>
                  <Tooltip title="Eliminar conversación" arrow>
  <IconButton
    onClick={() => deleteConversation(c._id)}
    sx={{
      color: "#aaa", // gris claro
      transition: "color 0.2s",
      "&:hover": {
        color: "#ff4d4d", // rojo al hacer hover
      },
    }}
  >
    <DeleteIcon />
  </IconButton>
</Tooltip>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Box>
    </Box>
  );

  // ✅ Contenido del sidebar
  const sidebarContent = (
   <Box
    sx={{
      width: 255,
      backgroundColor: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      
      height: "100vh",        // 🔧 que crezca con el contenido
      //minHeight: "115vh",     // 🔧 que al menos se estire como el contenedor padre

      position: "relative",   // Para evitar errores de overlay
    }}
  >

      <Box sx={{ px: 3, py: 3 }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 4 }}>
          DICTUM IA
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <Link to={item.to} key={item.text} style={{ textDecoration: "none", color: "#ccc" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                {item.icon}
                <Typography variant="body2">{item.text}</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>{renderHistorial()}</Box>
      <Box sx={{ px: 3, py: 2, borderTop: "1px solid #333" }}>
        {navLegalItems.map((item) => (
          <Link to={item.to} key={item.text} style={{ textDecoration: "none", color: "#ccc" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
              {item.icon}
              <Typography variant="body2">{item.text}</Typography>
            </Box>
          </Link>
        ))}

<Box sx={{ mt: 3 }}>
        <Link to="/precios" style={{ textDecoration: "none" }}>
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
      
    </Box>
    
    
    
  );



  // ✅ Renderizar Sidebar y Menú Hamburguesa
  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: "#fff", position: "absolute", top: 16, left: 16 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        sidebarContent
      )}
    </>
  );
}

export default Sidebar;
