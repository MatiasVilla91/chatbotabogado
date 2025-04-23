import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  const navItems = [
    { text: "Inicio", icon: <HomeIcon />, to: "/" },
    { text: "Características", icon: <InfoIcon />, to: "/caracteristicas" },
    { text: "Precios", icon: <MonetizationOnIcon />, to: "/precios" },
  ];

  const sidebarContent = (
    <Box
      sx={{
        width: 220,
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
          {navItems.map((item) => (
            <Tooltip title={item.text} placement="right" arrow key={item.text}>
              <Link
                to={item.to}
                style={{
                  textDecoration: "none",
                  color: "#ccc",
                }}
                onClick={() => setOpen(false)} // cierra drawer al navegar
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
                  <Typography variant="body2">{item.text}</Typography>
                </Box>
              </Link>
            </Tooltip>
          ))}
        </Box>
      </Box>

     
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          {/* Botón hamburguesa visible solo en mobile */}
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
