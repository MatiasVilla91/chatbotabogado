// Versión mejorada y final para landing oscura Dictum IA

import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Divider,
  Fab,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SavingsIcon from "@mui/icons-material/Savings";



const features = [
  { title: "Respuestas instantáneas", icon: <RocketLaunchIcon fontSize="large" />, description: "Consultas legales resueltas en segundos. Sin esperas." },
  { title: "Disponible 24/7", icon: <AccessTimeIcon fontSize="large" />, description: "Usalo cuando quieras, incluso feriados y fines de semana." },
  { title: "Privacidad asegurada", icon: <ShieldIcon fontSize="large" />, description: "Tus datos están protegidos. Nadie accede a tus consultas." },
  { title: "Normativa argentina vigente", icon: <CheckCircleIcon fontSize="large" />, description: "Basado en leyes reales y jurisprudencia actualizada." },
  {
  title: "Optimizado para profesionales",
  icon: <WorkOutlineIcon fontSize="large" />,
  description: "Ideal para abogados, estudios jurídicos y estudiantes avanzados."
},
{
  title: "Ahorro de tiempo y dinero",
  icon: <SavingsIcon fontSize="large" />,
  description: "Resolvés casos, contratos o dudas sin gastar horas ni pagar consultas."
}
];

const testimonios = [
  { nombre: "Juan M.", rol: "abogado", frase: "Me resolvió en 2 minutos lo que me hubiera llevado 2 horas de lectura.", avatar: "https://i.pravatar.cc/100?img=18" },
  { nombre: "Carolina D.", rol: "estudiante de abogacía", frase: "Lo uso para estudiar. Es como tener un profesor particular de Derecho.", avatar: "https://i.pravatar.cc/100?img=5" },
  { nombre: "Estudio Jurídico Zeta", rol: "firma legal", frase: "Reducimos un 80% el tiempo de redacción de contratos.", avatar: "https://i.pravatar.cc/100?img=8" }
];

const faqs = [
  { pregunta: "¿Dictum IA reemplaza a un abogado?", respuesta: "No. Es una herramienta de asistencia legal basada en IA. Complementa tu trabajo profesional." },
  { pregunta: "¿Qué pasa con mi privacidad?", respuesta: "Las consultas están protegidas y encriptadas. Nadie más accede a ellas." },
  { pregunta: "¿El plan gratis tiene límites?", respuesta: "Sí, incluye 5 consultas. Luego podés pasarte al plan premium o profesional." }
];

export default function LandingDark() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    
<Box
  sx={{
    position: "relative",
    background: "radial-gradient(circle at top right, #0a0a0a, #111 70%)",
    px: 2,
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    overflow: "hidden", // necesario para que no se desborde
  }}
>


       <Hero />
      
      <Divider sx={{ backgroundColor: "#1f2937", my: 6 }} /> 


      <Grid container spacing={10} justifyContent="center">
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={4.5} key={index}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Box textAlign="center" px={2}>
                <Box sx={{ color: "#3b82f6", mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6" mb={1} fontWeight={600}>{item.title}</Typography>
                <Typography variant="body2" color="#9ca3af">{item.description}</Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

   <Box mt={10}>
  <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
    Lo que dicen nuestros usuarios
  </Typography>

  <Grid container spacing={4} justifyContent="center">
    {testimonios.map((t, i) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
        <Box
          sx={{
            backgroundColor: "#1f1f1f",
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            height: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Avatar
            src={t.avatar}
            alt={t.nombre}
            sx={{ width: 56, height: 56, mx: "auto", mb: 2 }}
          />
          <Typography
            variant="body2"
            fontStyle="italic"
            color="#d1d5db"
            sx={{ mb: 1 }}
          >
            “{t.frase}”
          </Typography>
          <Typography variant="subtitle2" color="#FFFFFF">
            — {t.nombre}, {t.rol}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
</Box>

      <Box mt={10}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4.5}>Preguntas Frecuentes</Typography>
        <Box maxWidth={800} mx="auto">
          {faqs.map((faq, i) => (
            <Accordion key={i} sx={{ backgroundColor: "#1f1f1f", color: "#f4f4f5" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#0a84ff" }} />}>
                <Typography>{faq.pregunta}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="#cbd5e1">{faq.respuesta}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      <Box textAlign="center" mt={12} px={2}>
        <Typography variant="h5" fontWeight="bold" mb={2}>+12.000 consultas legales resueltas</Typography>
        <Typography variant="body1" color="#9ca3af" maxWidth={600} mx="auto" mb={4}>
          Unite a la comunidad legal que ya usa inteligencia artificial para trabajar, estudiar y decidir mejor.
        </Typography>
        <Button variant="contained" href="/register" sx={{ fontWeight: "bold", px: 4, py: 1.5 }}>
          Empezá gratis ahora
        </Button>
        <Typography variant="caption" color="#6b7280" mt={1} display="block">
          Sin tarjeta. Sin compromiso.
        </Typography>
      </Box>

      <Box mt={12} py={6} textAlign="center" borderTop="1px solid #1f2937">
        <Typography variant="body2" color="#6b7280">
          © {new Date().getFullYear()} Dictum IA — Asistencia legal con inteligencia artificial.
        </Typography>
        <Typography variant="body2" color="#4b5563" mt={1}>
          Hecho en Argentina 🔵⚪🔵 Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}
