import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GavelIcon from '@mui/icons-material/Gavel';
import FlashOnIcon from '@mui/icons-material/FlashOn';

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          DICTUM IA
        </Typography>
        <IconButton color="inherit" component={Link} to="/nuevahome">
          <HomeIcon />
        </IconButton>
        {token ? (
          <>
            <IconButton color="inherit" component={Link} to="/consultas">
              <GavelIcon />
            </IconButton>
            <IconButton color="inherit" onClick={logout}>
              <FlashOnIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton color="inherit" component={Link} to="/login">
              <LoginIcon />
            </IconButton>
            <IconButton color="inherit" component={Link} to="/register">
              <PersonAddIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
