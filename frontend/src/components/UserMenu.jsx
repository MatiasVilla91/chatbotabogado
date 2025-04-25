import {
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Typography,
    Divider,
  } from "@mui/material";
  import { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "../context/AuthContext";
  
  function UserMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext); // ✅ AHORA dentro del componente
  
    // Obtener iniciales del usuario
    const initials = user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);
  
    const handleLogout = () => {
      logout();
      handleClose();
      navigate("/login");
    };

    
  console.log("🧑‍💻 Usuario en contexto:", user);
  
    return (
      <>
        <IconButton onClick={handleClick} sx={{ ml: 2 }}>
          <Avatar sx={{ bgcolor: "#0a84ff", width: 36, height: 36 }}>
            {initials}
          </Avatar>
        </IconButton>
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
              minWidth: 220,
            },
          }}
        >
          <MenuItem onClick={() => { navigate("/planes"); handleClose(); }}>
            💳 Mejorar plan
          </MenuItem>
          <Divider sx={{ backgroundColor: "#444" }} />
          <MenuItem onClick={handleLogout}>
            🔓 Cerrar sesión
          </MenuItem>
        </Menu>
      </>
    );
  }


  
  export default UserMenu;
  