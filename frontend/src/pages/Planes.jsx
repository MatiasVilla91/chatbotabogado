import { Container, Typography, Grid, Paper } from "@mui/material";

function Planes() {
  return (
    <Container>
      <Typography variant="h4">Planes y Precios</Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Gratis</Typography>
            <Typography variant="body2">Incluye 5 consultas legales y 2 contratos.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Premium</Typography>
            <Typography variant="body2">Consultas y contratos ilimitados.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Planes;
