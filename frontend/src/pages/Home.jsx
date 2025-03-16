import { Container, Typography, Button, Box, Divider, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, textAlign: "center" }}>
      <Paper elevation={3} sx={{ padding: 5, borderRadius: 3 }}>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: "bold", color: "#eeee" }}>
          Transforma tu práctica legal hoy
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          La inteligencia artificial que potencia tu éxito.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          ¿Te sientes abrumado por la complejidad legal? <strong>DICTUM IA</strong> te ofrece respuestas rápidas, precisas y actualizadas. Accede a un asistente 24/7 y toma decisiones legales seguras en cuestión de minutos.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Beneficios exclusivos para ti:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" /> Respuestas inmediatas a tus consultas legales.
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" /> Optimiza tu tiempo y aumenta tu productividad.
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" /> Accede a un asistente disponible 24/7.
          </Typography>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" /> Información precisa y respaldada por las últimas normativas.
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" sx={{ mb: 3 }}>
          Comienza sin riesgos y descubre cómo <strong>DICTUM IA</strong> puede transformar tu manera de trabajar.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" color="primary" size="large" component={Link} to="/login" sx={{ padding: '12px 24px', fontWeight: 'bold' }}>
            Accede Ahora
          </Button>
          <Button variant="outlined" color="secondary" size="large" component={Link} to="/register" sx={{ padding: '12px 24px', fontWeight: 'bold' }}>
            Empieza Gratis
          </Button>
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 4, color: "gray" }}>
          *Oferta válida hasta el 31 de marzo. ¡No dejes pasar la oportunidad de revolucionar tu práctica legal!
        </Typography>
      </Paper>
    </Container>
  );
}

export default Home;
