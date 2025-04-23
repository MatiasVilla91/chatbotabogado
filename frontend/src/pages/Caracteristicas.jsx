import {
    Box,
    Typography,
    Grid,
  } from "@mui/material";
  import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
  import AccessTimeIcon from "@mui/icons-material/AccessTime";
  import ShieldIcon from "@mui/icons-material/Shield";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  
  const features = [
    {
      title: "Respuestas rápidas",
      icon: <RocketLaunchIcon fontSize="large" />,
      description: "Nuestro motor de IA responde consultas legales en segundos, ahorrándote tiempo valioso.",
    },
    {
      title: "Disponible 24/7",
      icon: <AccessTimeIcon fontSize="large" />,
      description: "Accedé al servicio en cualquier momento del día, incluso los fines de semana y feriados.",
    },
    {
      title: "Información confiable",
      icon: <CheckCircleIcon fontSize="large" />,
      description: "Basado en normativa legal vigente y ajustado a las leyes argentinas.",
    },
    {
      title: "Segura y privada",
      icon: <ShieldIcon fontSize="large" />,
      description: "Tus datos y consultas están protegidos con cifrado y nunca se comparten.",
    },
  ];
  
  function Caracteristicas() {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#111",
          color: "#fff",
          py: 10,
          px: { xs: 2, md: 10 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}>
          Características de Dictum IA
        </Typography>
  
        <Grid container spacing={6}>
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box textAlign="center" px={2}>
                <Box sx={{ color: "#0a84ff", mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>{item.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  
  export default Caracteristicas;
  