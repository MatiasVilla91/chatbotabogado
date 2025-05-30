// src/pages/Pending.jsx
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Pending() {
  const navigate = useNavigate();

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
      <Typography variant="h4" gutterBottom color="warning.main">
        ⏳ Tu pago está pendiente
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        MercadoPago todavía está procesando tu transacción. Te notificaremos cuando se confirme.
      </Typography>
      <Button variant="outlined" onClick={() => navigate("/consultas")}>
        Ir a la app
      </Button>
    </Box>
  );
}

export default Pending;
