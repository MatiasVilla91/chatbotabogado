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
    <AppBar 
  position="fixed" 
  sx={{
    backgroundColor: 'transparent',
    boxShadow: 'none',
    backdropFilter: 'blur(10px)',
    padding: '10px 20px',
    zIndex: 10
  }}
>
  <Toolbar>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }}>
     
    </Typography>
    <IconButton color="inherit" component={Link} to="/">
      <HomeIcon sx={{ color: '#fff' }} />
    </IconButton>
    {token ? (
      <>
        <IconButton color="inherit" component={Link} to="/consultas">
          <GavelIcon sx={{ color: '#fff' }} />
        </IconButton>
        <IconButton color="inherit" onClick={logout}>
          <FlashOnIcon sx={{ color: '#fff' }} />
        </IconButton>
      </>
    ) : (
      <>
        <IconButton color="inherit" component={Link} to="/login">
          <LoginIcon sx={{ color: '#fff' }} />
        </IconButton>
        <IconButton color="inherit" component={Link} to="/register">
          <PersonAddIcon sx={{ color: '#fff' }} />
        </IconButton>
      </>
    )}
  </Toolbar>
</AppBar>

  );
}

export default Navbar;
