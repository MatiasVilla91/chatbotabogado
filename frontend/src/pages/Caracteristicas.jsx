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
    <Box sx={{ backgroundColor: "#111", color: "#fff", px: { xs: 2, md: 1 } }}>

      {/* HERO SECTION */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: -1, color: "#0a84ff" }}>
          ¿Sos abogado o estudiante de Derecho?
        </Typography>
        <Typography variant="h6" sx={{ color: "#ccc", maxWidth: 720, mx: "auto", fontWeight: 300 }}>
          Descubrí cómo miles ya resuelven dudas legales en segundos con Inteligencia Artificial.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/precios"
          sx={{ mt: 4, px: 6, py: 1.5, fontWeight: "bold", backgroundColor: "#0a84ff", "&:hover": { backgroundColor: "#006ee6" } }}
        >
          Ver planes disponibles
        </Button>
        <Typography variant="body2" sx={{ color: "#aaa", mt: 2 }}>
          
          ✅ Consultas ilimitadas en el plan Pro <br />
          ✅ Información 100% argentina y actualizada <br />
          ✅ Ahorra tiempo <br />
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#ff9800", mt: 2 }}>
          ⚠️ Esta semana: acceso gratuito limitado al plan Premium. ¡Aprovechalo ahora!
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: "#333", mb: 6 }} />

      {/* BENEFICIOS SEO */}
      <Box textAlign="center" mt={8} px={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          ¿Por qué elegir Dictum IA?
        </Typography>
        <Typography variant="body1" sx={{ color: "#aaa", maxWidth: 800, mx: "auto" }}>
          Dictum IA es la plataforma líder de inteligencia artificial legal en Argentina. Diseñada para abogados, estudiantes y estudios jurídicos, nuestra herramienta legal automatizada resuelve miles de consultas jurídicas por mes, reduciendo tiempos, costos y errores. Ideal para quienes buscan soluciones legales rápidas, precisas y sin complicaciones. Usá Dictum IA para consultas jurídicas online, generación automática de contratos legales y asistencia legal en tiempo real. Potenciá tu práctica profesional con la mejor IA para abogados del país.
        </Typography>
      </Box>

      {/* FEATURES */}
      <Grid container spacing={6} mt={6}>
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

      {/* TESTIMONIOS */}
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Lo que dicen nuestros usuarios
        </Typography>
        <Typography variant="body2" sx={{ color: "#aaa", fontStyle: "italic", mb: 1 }}>
          "Con Dictum IA respondí en minutos una duda que antes me llevaba horas de investigación." <br />– Valeria, abogada en Córdoba
        </Typography>
        <Typography variant="body2" sx={{ color: "#aaa", fontStyle: "italic" }}>
          "Ideal para preparar parciales o finales de Derecho. Es como tener un tutor 24/7." <br />– Facundo, estudiante de abogacía
        </Typography>
      </Box>

      {/* CTA FINAL */}
      <Box textAlign="center" mt={10} px={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          +12.000 consultas legales resueltas por Dictum IA
        </Typography>
        <Typography variant="body1" sx={{ color: "#aaa", maxWidth: 600, mx: "auto", mb: 4 }}>
          Abogados, estudiantes y ciudadanos ya usan Dictum todos los días para ahorrar tiempo, reducir errores y tomar mejores decisiones. Unite hoy a la revolución legal impulsada por IA.
        </Typography>
        <Button
          variant="contained"
          href="/register"
          sx={{ px: 5, py: 1.5, fontWeight: "bold", fontSize: "1rem", backgroundColor: "#0a84ff", "&:hover": { backgroundColor: "#006ee6" } }}
        >
          Empezá gratis ahora
        </Button><br />
        <Typography variant="caption" sx={{ color: "#aaa", mt: 1 }}>
          Sin tarjeta. Sin compromiso.
        </Typography>
      </Box>
    </Box>
  );
}
