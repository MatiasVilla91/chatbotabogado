import { Box, Typography, Button, Grid, Container } from "@mui/material";

const Hero = () => {
  return (
    <Box
      sx={{
        position: "relative",
        background:  `radial-gradient(circle at top left, rgba(10,10,10,0.8), transparent 400px),
                     l  inear-gradient(to bottom, #0f0f0f  0%, #111 200%)`,
        overflow: "hidden",
        py: { xs: 10, md: 5 },
        px: 2,
      }}
    >
      {/* Círculo decorativo detrás */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 500,
          background: "#0a84ff",
          borderRadius: "500%",
          top: "-100px",
          left: "-100px",
          filter: "blur(150px)",
          opacity: 0.2,
        }}
      />
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Texto */}
          <Grid item xs={12} md={6}>
            <Typography variant="h2" fontWeight={800} sx={{ color: "#e5e7eb", mb: 3 }}>
              Inteligencia Artificial Legal
              <br />
              <Box component="span" sx={{ color: "#60a5fa" }}>Hecha en Argentina</Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "#94a3b8", mb: 4 }}>
              Dictum IA responde consultas, redacta contratos y potencia tu práctica jurídica. Todo en segundos.
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/register"
              sx={{
                px: 5,
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
          </Grid>

          {/* Imagen */}
          <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;