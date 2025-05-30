// src/pages/Failure.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function Failure() {
  const navigate = useNavigate();

  useEffect(() => {
    console.warn("⚠️ El pago fue rechazado o cancelado.");
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#111"
      color="#fff"
      textAlign="center"
      px={3}
    >
      <Typography variant="h4" gutterBottom color="error">
        ❌ El pago no pudo completarse
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Hubo un problema con tu transacción. No se procesó el pago.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/precios")}>
        Volver a intentar
      </Button>
    </Box>
  );
}

export default Failure;
