import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <AppBar position="static"   >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IA Abogados
        </Typography>
        <Button color="inherit" component={Link} to="/">Inicio</Button>
        {token ? (
          <>
            <Button color="inherit" component={Link} to="/consultas">Consultas</Button>
            <Button color="inherit" onClick={logout}>Cerrar Sesión</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
        <Button color="inherit" component={Link} to="/register">
  Registrarse
</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
