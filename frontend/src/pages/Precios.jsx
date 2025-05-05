// src/pages/Precios.jsx
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

import ContentCard from "../components/ContentCard";

const planes = [
  {
    nombre: "Gratis",
    precio: "$0",
    descripcion: "Probá la app totalmente Gratis",
    beneficios: [
      "5 consultas legales con IA especializada",
      "Soporte básico",
    ],
    boton: "Empezar gratis",
  },
  {
    nombre: "Premium",
    precio: "$35.000 Arg/mes",
    descripcion: "Ideal ara abogados en ejercicio ó estudios jurídicos ",
    beneficios: [
      "Consultas ilimitadas",
      "Atención prioritaria",
      "Actualizaciones automáticas",

    ],
    boton: "Unirme al plan Premium",
  },
];

function Precios() {
  return (
    <ContentCard>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#fff", fontWeight: "bold", mb: 4 }}
      >
        Planes y Precios
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={3}
        sx={{ maxWidth: "100%", width: "100%" }}
      >
        {planes.map((plan, index) => (
          <Card
          key={index}
          sx={{
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            width: { xs: "100%", sm: "100%", md: "300px" },
            flex: "1 1 300px",
            p: 2,
          }}
        >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
              >
                {plan.nombre}
              </Typography>
              <Typography
                 component="p"
                 sx={{
                   textAlign: "center",
                   color: "#0a84ff",
                   fontWeight: "bold",
                   mb: 2,
                   fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
                   lineHeight: 1.2,
                 }}
               >
                 {plan.precio}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {plan.descripcion}
              </Typography>
              <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
                {plan.beneficios.map((item, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{item}</li>
                ))}
              </ul>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#0a84ff",
                  ":hover": { backgroundColor: "#0069d9" },
                }}
              >
                {plan.boton}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      </ContentCard>
  );
}

export default Precios;
