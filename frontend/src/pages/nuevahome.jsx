import { Container, Typography, Button, Box, Divider, Paper, Grid, AppBar, Toolbar, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';



function NuevaHome() {
  

  return (
    <Container maxWidth="lg" sx={{ mt: 6, textAlign: "center" }}>   
      <Paper elevation={10} sx={{ padding: 5, borderRadius: 4, backgroundImage: 'url(/justice-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'multiply', backgroundColor: '#1a1a1a' }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: "bold", color: "#42a5f5" }}>
        DICTUM es la IA que potencia tu Éxito.
        </Typography>

        <Typography variant="h5" sx={{ mb: 4, color: '#fff' }}>
          Respuestas rápidas, precisas y actualizadas con <strong>DICTUM IA</strong>. Accede a un asistente 24/7 y toma decisiones legales en cuestión de minutos.
        </Typography>

        <Button component={Link} to="/register" variant="contained" size="large" sx={{ mb: 4, padding: '16px 32px', fontWeight: 'bold', background: 'linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)', borderRadius: '20px', boxShadow: '0 4px 15px rgba(66, 165, 245, 0.6)' }}>
          🚀 Comienza tu Prueba Gratis
        </Button>

        <Divider sx={{ my: 4, backgroundColor: '#616161' }} />

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#212121', '&:hover': { backgroundColor: '#2e2e2e' } }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
              <Typography variant="body1" sx={{ mt: 1, color: '#fff' }}>
              Respuestas inmediatas a tus consultas legales
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#212121', '&:hover': { backgroundColor: '#2e2e2e' } }}>
              <VerifiedUserIcon color="success" sx={{ fontSize: 50 }} />
              <Typography variant="body1" sx={{ mt: 1, color: '#fff' }}>
                Respuestas  Accede a un asistente IA especializado en leyes Argentinas disponible 24/7
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#212121', '&:hover': { backgroundColor: '#2e2e2e' } }}>
              <AccessTimeIcon color="success" sx={{ fontSize: 50 }} />
              <Typography variant="body1" sx={{ mt: 1, color: '#fff' }}>
              Optimiza tu tiempo y aumenta tu productividad
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#212121', '&:hover': { backgroundColor: '#2e2e2e' } }}>
              <GavelIcon color="success" sx={{ fontSize: 50 }} />
              <Typography variant="body1" sx={{ mt: 1, color: '#fff' }}>
              Información precisa y respaldada por las últimas normativas
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: '#616161' }} />

        <Button component={Link} to="/register" variant="outlined" size="large" sx={{ padding: '16px 32px', fontWeight: 'bold', borderColor: '#ff5252', color: '#ff5252', borderRadius: '20px', '&:hover': { backgroundColor: '#ff5252', color: '#fff' } }}>
          ⚡ Suscribirse Ahora ⚡
        </Button>
      </Paper>
    </Container>
  );
}

export default NuevaHome;
