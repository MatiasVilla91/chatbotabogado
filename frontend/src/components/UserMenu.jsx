import {
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon,
    Tooltip,
    Snackbar,
    Alert, // ✅ esto te faltaba
  } from "@mui/material";
  import { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "../context/AuthContext";
  
  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import SettingsIcon from "@mui/icons-material/Settings";
  import LogoutIcon from "@mui/icons-material/Logout";
  import UpgradeIcon from "@mui/icons-material/WorkspacePremium";
  import DescriptionIcon from "@mui/icons-material/Description";
  
  function UserMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { logout, user } = useContext(AuthContext);
  
    const initials = user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
  
    const handleLogout = () => {
      logout();
      setSnackbarOpen(true); // ✅ Mostrar mensaje
      setAnchorEl(null);     // Cerrar menú
      handleClose();
      setTimeout(() => {
        navigate("/",{    state: { message: "Sesión cerrada correctamente" }
        });
      }, 10);
    };
  
    return (
      <>
        <Tooltip title={user?.name || "Mi cuenta"}>
          <IconButton onClick={handleClick} sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: "#0a84ff", width: 36, height: 36 }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>
  
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              backgroundColor: "#1f1f1f",
              color: "#fff",
              mt: 1.5,
              borderRadius: 2,
              minWidth: 240,
            },
          }}
        >
          <MenuItem onClick={() => { navigate("/perfil"); handleClose(); }}>
            <ListItemIcon><AccountCircleIcon sx={{ color: "#ccc" }} /></ListItemIcon>
            Ver perfil
          </MenuItem>{/*
          <MenuItem onClick={() => { navigate("/configuracion"); handleClose(); }}>
            <ListItemIcon><SettingsIcon sx={{ color: "#ccc" }} /></ListItemIcon>
            Configuración
          </MenuItem>*/}
  
          <Divider sx={{ backgroundColor: "#444" }} />
 
          <MenuItem onClick={() => { navigate("/precios"); handleClose(); }}>
            <ListItemIcon><UpgradeIcon sx={{ color: "#ccc" }} /></ListItemIcon>
            Mejorar plan
          </MenuItem> {/*
          <MenuItem onClick={() => { navigate("/historial"); handleClose(); }}>
            <ListItemIcon><DescriptionIcon sx={{ color: "#ccc" }} /></ListItemIcon>
            Mis contratos
          </MenuItem>
  */ }
          <Divider sx={{ backgroundColor: "#444" }} />
  
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon sx={{ color: "#ccc" }} /></ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
  
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Sesión cerrada correctamente
          </Alert>
        </Snackbar>
      </>
    );
  }
  
  export default UserMenu;
  