// src/pages/Success.jsx
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

function Success() {
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://chatbotabogado.onrender.com/api/usuario/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No se pudo actualizar la sesión");

        const userData = await res.json();
        login(token, userData); // actualiza el contexto con datos nuevos

        // redirige al área premium o consultas
        navigate("/consultas");
      } catch (error) {
        console.error("❌ Error actualizando usuario:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [token, login, navigate]);

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
      <CircularProgress size={60} color="primary" />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Confirmando tu pago y activando Dictum Premium...
      </Typography>
    </Box>
  );
}

export default Success;
