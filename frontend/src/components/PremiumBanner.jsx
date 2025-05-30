// src/components/PremiumBanner.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography } from '@mui/material';

function PremiumBanner() {
  const { user } = useContext(AuthContext);

  if (!user?.esPremium || !user?.fechaFinPremium) return null;

  const fecha = new Date(user.fechaFinPremium).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      sx={{
        backgroundColor: '#0a84ff',
        color: '#fff',
        py: 1,
        px: 2,
        textAlign: 'center',
        fontSize: '0.9rem',
      }}
    >
      <Typography>
        🏆 Tu cuenta es <strong>Premium</strong> hasta el <strong>{fecha}</strong>
      </Typography>
    </Box>
  );
}

export default PremiumBanner;
