import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Divider,
  Fab
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";

const features = [
  {
    title: "Asistencia legal al instante",
    icon: <RocketLaunchIcon fontSize="large" />,
    description: "Obtené respuestas claras y precisas en segundos. Sin esperas. Sin burocracia.",
  },
  {
    title: "Disponible 24/7",
    icon: <AccessTimeIcon fontSize="large" />,
    description: "Consultá cualquier día y a cualquier hora. Incluso feriados.",
  },
  {
    title: "Información actualizada",
    icon: <CheckCircleIcon fontSize="large" />,
    description: "Basado en normativa argentina vigente y jurisprudencia real.",
  },
  {
    title: "Privacidad garantizada",
    icon: <ShieldIcon fontSize="large" />,
    description: "Tus consultas están protegidas. Nadie accede a tu información.",
  },
];

export default function Caracteristicas() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ background: "#111", color: "#fff", px: 2, position: "relative" }}>

      {/* STICKY CTA */}
      <Fab 
        variant="extended"
        color="primary"
        href="/register"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          backgroundColor: "#0a84ff",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#006ee6" }
        }}
      >
        <ChatIcon sx={{ mr: 1 }} /> Probá gratis Dictum IA
      </Fab>

      {/* HERO */}
      <Box textAlign="center" pt={10} pb={5}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0a84ff", mb: 2 }}>
          ¿Tenés dudas legales y poco tiempo?
        </Typography>
        <Typography variant="h6" sx={{ color: "#ccc", maxWidth: 720, mx: "auto", fontWeight: 300 }}>
          Cientos de abogados y estudiantes ya usan Dictum IA para resolver problemas jurídicos, estudiar y redactar contratos sin errores.
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
        {/*<Typography variant="subtitle2" sx={{ color: "#ff9800", mt: 2, fontWeight: "bold" }}>
          ⚠️ Solo por esta semana: acceso Premium gratis limitado. ¡Probalo ahora!
        </Typography>*/}
      </Box>

      <Divider sx={{ backgroundColor: "#333", mb: 6 }} />

      {/* FEATURES */}
      <Box textAlign="center">
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          ¿Por qué elegir Dictum IA?
        </Typography>
        <Typography variant="body1" sx={{ color: "#aaa", maxWidth: 800, mx: "auto", mb: 4 }}>
          La plataforma legal con inteligencia artificial más completa de Argentina. Ideal para resolver consultas, redactar contratos y preparar exámenes. Precisión y rapidez legal al alcance de todos.
        </Typography>
        <Grid container spacing={6} mt={2} justifyContent="center">
          {features.slice(0, 2).map((item, index) => (
            <Grid item xs={12} sm={6} md={5} key={index}>
              <Box textAlign="center" px={2}>
                <Box sx={{ color: "#0a84ff", mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>{item.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={6} mt={2} justifyContent="center">
          {features.slice(2).map((item, index) => (
            <Grid item xs={12} sm={6} md={5} key={index}>
              <Box textAlign="center" px={2}>
                <Box sx={{ color: "#0a84ff", mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>{item.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

    


      {/* TESTIMONIOS */}
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
          Lo que dicen nuestros usuarios
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: "#222", p: 3, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontStyle: "italic", color: "#ccc" }}>
                “Me resolvió en 2 minutos lo que me hubiera llevado 2 horas de lectura.”
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: "#0a84ff" }}>
                — Juan M., abogado laboralista
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: "#222", p: 3, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontStyle: "italic", color: "#ccc" }}>
                “Lo uso para estudiar. Es como tener un profesor particular de Derecho.”
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, color: "#0a84ff" }}>
                — Carolina D., estudiante de abogacía
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* RESULTADOS REALES */}
      <Box mt={10} textAlign="center">
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Casos reales. Resultados reales.
        </Typography>
        <Typography variant="body2" sx={{ color: "#aaa", maxWidth: 700, mx: "auto" }}>
          ✅ Un abogado laboralista de Rosario resolvió 27 consultas en una semana con Dictum IA.<br />
          ✅ Una estudiante aprobó Derecho Laboral utilizando la app como asistente de estudio.<br />
          ✅ Un estudio jurídico automatizó contratos y redujo errores en un 80%.
        </Typography>
      </Box>

      {/* CTA FINAL */}
      <Box textAlign="center" mt={10} px={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          +12.000 consultas legales resueltas por Dictum IA
        </Typography>
        <Typography variant="body1" sx={{ color: "#aaa", maxWidth: 600, mx: "auto", mb: 4 }}>
          Unite a la comunidad legal que ya usa inteligencia artificial para trabajar, estudiar y decidir mejor.
        </Typography>
        <Button
          variant="contained"
          href="/register"
          sx={{ px: 5, py: 1.5, fontWeight: "bold", fontSize: "1rem", backgroundColor: "#0a84ff", "&:hover": { backgroundColor: "#006ee6" } }}
        >
          Empezá gratis ahora
        </Button>
        <Typography variant="caption" sx={{ color: "#aaa", mt: 1 }}>
          Sin tarjeta. Sin compromiso.
        </Typography>
      </Box>

      {/* FOOTER */}
      <Box mt={12} py={6} sx={{ backgroundColor: "#111", textAlign: "center", borderTop: "1px solid #222" }}>
        <Typography variant="body2" sx={{ color: "#667" }}>
          © {new Date().getFullYear()} Dictum IA — Asistencia legal con inteligencia artificial.
        </Typography>
        <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
          Hecho con 🔵⚪🔵 en Argentina. Todos los derechos reservados.
        </Typography>
      </Box>

    </Box>
  );
}
