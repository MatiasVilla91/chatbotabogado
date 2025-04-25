import { Container, Typography } from "@mui/material";

function Historial() {
  return (
    <Container>
      <Typography variant="h4">Historial de Consultas</Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Aquí se mostrarán las consultas previas del usuario.
      </Typography>
    </Container>
  );
}

export default Historial;
