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
import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  const navItems = [
    { text: "Inicio", icon: <HomeIcon />, to: "/" },
    { text: "Características", icon: <InfoIcon />, to: "/caracteristicas" },
    { text: "Precios", icon: <MonetizationOnIcon />, to: "/precios" },
    { text: "Historial", icon: <HistoryIcon />, to: "/historial" },
  ];

  const navLegalItems = [
    { text: "Términos", icon: <GavelIcon />, to: "/terminos" },
    { text: "Privacidad", icon: <LockIcon />, to: "/privacidad" },
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
              <Typography variant="body2"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              >{item.text}

              </Typography>
            </Box>
          </Link>
        </Tooltip>
      ))}
    </>
  );

  const sidebarContent = (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#1a1a1a",
        px: 3,
        py: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
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

      {/* ⚖️ Links legales abajo del todo */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {renderNavLinks(navLegalItems)}
      </Box>

      <Box sx={{ mt: 3 }}>
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
  

  return (
    <>
      {isMobile ? (
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
      )}
    </>
  );
}

export default Sidebar;
