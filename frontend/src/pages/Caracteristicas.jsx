import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Divider,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const features = [
  {
    title: "Asistencia legal al instante",
    icon: <RocketLaunchIcon fontSize="large" />,
    description: "Obtené respuestas claras y precisas en segundos. Sin esperas. Sin burocracia.",
  },
  {
    title: "Disponible 24/7 Siempre que lo necesites",
    icon: <AccessTimeIcon fontSize="large" />,
    description: "Dictum IA está listo para ayudarte en cualquier momento y en cualquier hora, incluso fines de semana y feriados.",
  },
  {
    title: "Información confiable y actualizada",
    icon: <CheckCircleIcon fontSize="large" />,
    description: "Entrenado con normativa y jurisprudencia argentina. Precisión legal garantizada.",
  },
  {
    title: "Privacidad y seguridad total",
    icon: <ShieldIcon fontSize="large" />,
    description: "Tus consultas están protegidas. Nadie accede a tu información.",
  },
];

export default function Caracteristicas() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        backgroundColor: "#111",
        color: "#fff",
        //py: 6,
        px: { xs: 2, md: 1 },
      }}
    >
      {/* HERO SECTION */}
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mb: -5, color: "#0a84ff" }}
        >
          Dictum IA
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#ccc",
            maxWidth: 720,
            mx: "auto",
            fontWeight: 300,
          }}
        >
          Es la Inteligencia Artificial
          que cambia para siempre tu relación con el Derecho
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/precios"
          sx={{
            mt: 4,
            px: 6,
            py: 1.5,
            fontWeight: "bold",
            backgroundColor: "#0a84ff",
            "&:hover": {
              backgroundColor: "#006ee6",
            },
          }}
        >
          Ver planes disponibles
        </Button>
      </Box>

      <Divider sx={{ backgroundColor: "#333", mb: 6 }} />

      {/* FEATURES */}
      <Grid container spacing={6}>
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box textAlign="center" px={2}>
              <Box sx={{ color: "#0a84ff", mb: 1 }}>{item.icon}</Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                {item.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* SOCIAL PROOF / CTA FINAL */}
      <Box textAlign="center" mt={10} px={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          +12.000 consultas legales resueltas por Dictum IA
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#aaa",
            maxWidth: 600,
            mx: "auto",
            mb: 4,
          }}
        >
          Abogados, estudiantes y ciudadanos ya usan Dictum todos los días
          para ahorrar tiempo, reducir errores y tomar mejores decisiones.
        </Typography>
        <Button
          variant="contained"
          href="/register"
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: "bold",
            backgroundColor: "#0a84ff",
            "&:hover": {
              backgroundColor: "#006ee6",
            },
          }}
        >
          Registrate gratis ahora
        </Button>
      </Box>
    </Box>
  );
}
