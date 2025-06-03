// src/pages/SobreNosotros.jsx
import { Box, Typography, Grid, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";

const SobreNosotros = () => {
  return (
    <MainLayout>
      <Box
        sx={{
          py: 6,
          px: 3,
          minHeight: "100vh",
          color: "#e0e0e0",
        }}
      >
        <Box
          sx={{
            maxWidth: "900px",
            mx: "auto",
            p: 4,
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
              Sobre Dictum IA
            </Typography>

            <Typography variant="h6" textAlign="center" color="#94a3b8" mb={4}>
              Transparencia, innovación y compromiso legal.
            </Typography>

            <Typography variant="body1" mb={3}>
              Nuestro objetivo es simple: ayudarte a resolver dudas legales, redactar documentos importantes y optimizar tu tiempo profesional.
            </Typography>

            <Typography variant="body1" mb={3}>
              Dictum fue creado por un equipo apasionado por la tecnología, la inteligencia artificial y el derecho. Creemos que las herramientas de IA pueden potenciar a los abogados, no reemplazarlos.
            </Typography>

            <Typography variant="body1" mb={3}>
              Nos comprometemos con la mejora continua. Escuchamos cada sugerencia y trabajamos todos los días para llevar Dictum IA a otro nivel.
            </Typography>

            <Grid container spacing={4} mt={5} justifyContent="center">
              <Grid item xs={12} md={4} textAlign="center">
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 2,
                    fontSize: 40,
                    bgcolor: "#0a84ff",
                  }}
                >
                  MV
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Matías Villa
                </Typography>
                <Typography variant="body2" color="gray">
                  Fundador & Desarrollador
                </Typography>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default SobreNosotros;
