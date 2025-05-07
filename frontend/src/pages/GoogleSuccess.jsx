// GoogleSuccess.jsx
import { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Typography, Box } from '@mui/material';

function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processLogin = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
          setError("No se encontró el token. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Guardamos el token en el contexto y localStorage
        login(token);
        console.log("✅ Token recibido:", token);
        navigate("/consultas", { replace: true });
      } catch (err) {
        console.error("❌ Error al procesar el login:", err);
        setError("Ocurrió un error al iniciar sesión. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    processLogin();
  }, [location, login, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      bgcolor="#111"
      color="#fff"
    >
      {loading ? (
        <>
          <CircularProgress size={60} color="primary" />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Iniciando sesión con Google...
          </Typography>
        </>
      ) : (
        <Typography variant="h6" color="error">
          {error || "Redirigiendo..."}
        </Typography>
      )}
    </Box>
  );
}

export default GoogleSuccess;
