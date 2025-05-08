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
      console.log("🌐 Iniciando proceso de login con Google...");

      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        console.log("🌐 Token recibido:", token);

        if (!token) {
          setError("No se encontró el token. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // ✅ Verificar si el token es válido (opcional pero recomendado)
        if (token.length < 50) {
          setError("Token inválido. Redirigiendo al login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // ✅ Guardamos el token y el usuario en el contexto
        login(token, { email: "Usuario de Google" });
        console.log("✅ Usuario autenticado con Google.");

        // ✅ Redirigir de inmediato
        navigate("/consultas", { replace: true });
      } catch (err) {
        console.error("❌ Error al procesar el login:", err);
        setError("Ocurrió un error al iniciar sesión. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 2000);
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