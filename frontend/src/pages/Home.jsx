import { Container, Typography } from "@mui/material";

function Home() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Bienvenido a IA Abogados
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Este asistente legal está diseñado para ayudar a abogados con sus consultas legales de manera rápida y precisa.
      </Typography>
    </Container>
  );
}

export default Home;
