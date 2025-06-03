// src/pages/GoogleSuccess.jsx
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
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processLogin = async () => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const userParam = params.get("user");

        if (!token || !userParam) {
          setError("Faltan datos. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        if (token.length < 50) {
          setError("Token inválido. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log("✅ Usuario recibido:", userData);
        login(token, userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);


       setTimeout(() => {
  window.location.href = "/consultas";
}, 300);

      } catch (err) {
        console.error("❌ Error al procesar el login:", err);
        setError("Ocurrió un error al iniciar sesión. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    processLogin();
  }, [location, login, navigate, isProcessing]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      bgcolor="#111"
      color="#fff"
      textAlign="center"
    >
      {loading ? (
        <>
          <CircularProgress size={60} color="primary" />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Iniciando sesión con Google...
          </Typography>
        </>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <Typography variant="h6" color="success">
          ¡Inicio de sesión exitoso! Redirigiendo...
        </Typography>
      )}
    </Box>
  );
}

export default GoogleSuccess;
