import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GavelIcon from '@mui/icons-material/Gavel';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const isActive = (path) => location.pathname === path;
  const iconStyle = (active) => ({
    color: active ? '#0a84ff' : '#fff',
    transform: active ? 'scale(1.2)' : 'scale(1)',
    transition: 'all 0.2s ease'
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none', backdropFilter: 'blur(10px)', padding: '10px 20px', zIndex: 10 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }}>
          DICTUM IA
        </Typography>

        <IconButton component={Link} to="/">
          <HomeIcon sx={iconStyle(isActive("/"))} />
        </IconButton>

        {token ? (
          <>
            <IconButton component={Link} to="/consultas">
              <GavelIcon sx={iconStyle(isActive("/consultas"))} />
            </IconButton>
            <IconButton onClick={handleMenu}>
              <AccountCircleIcon sx={iconStyle(false)} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: '2px' }}
            >
              {/*<MenuItem onClick={handleClose} component={Link} to="/consultas">Mis Consultas</MenuItem>*/}
              {/*<MenuItem onClick={handleClose} component={Link} to="/contratos">Mis Contratos</MenuItem>*/}
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <IconButton component={Link} to="/login">
              <LoginIcon sx={iconStyle(isActive("/login"))} />
            </IconButton>
            <IconButton component={Link} to="/register">
              <PersonAddIcon sx={iconStyle(isActive("/register"))} />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
