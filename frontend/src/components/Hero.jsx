import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <Box
      sx={{
        position: "relative",
        background: `radial-gradient(circle at top left, rgba(10,10,10,0.5), transparent 400px),
                     linear-gradient(to bottom, #0f0f0f 0%, #111 100%)`,
        overflow: "hidden",
        py: { xs: 10, md: 12 },
        px: 2,
      }}
    >
      {/* Círculo animado */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.2 }}
        style={{
          position: "absolute",
          width: 300,
          height: 500,
          background: "#0a84ff",
          borderRadius: "500%",
          top: "-100px",
          left: "-100px",
          filter: "blur(150px)",
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Texto animado */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" fontWeight={800} sx={{ color: "#e5e7eb", mb: 3 }}>
                Inteligencia Artificial Legal
                <br />
                <Box component="span" sx={{ color: "#60a5fa" }}>Hecha en Argentina</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: "#94a3b8", mb: 4 }}>
                Dictum IA responde consultas, redacta contratos y potencia tu práctica jurídica. Todo en segundos.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Button
                variant="contained"
                size="large"
                href="/register"
                sx={{
                  px: 20,
                  py: 2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#0a84ff",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                }}
              >
                Probalo gratis
              </Button>
            </motion.div>
          </Grid>

          {/* Imagen animada */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <img
                  src="20_22_29.png"
                  alt="Ilustración legal tech"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
