// src/pages/Precios.jsx
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import ContentCard from "../components/ContentCard";
import { useNavigate } from "react-router-dom";

const planes = [
  {
    nombre: "Gratis",
    precio: "$0",
    descripcion: "Probá la app sin compromiso",
    beneficios: [
      "5 consultas legales con IA especializada",
      "Soporte básico",
    ],
    boton: "Probar gratis",
  },
  {
    nombre: "Premium",
    precio: "$35.000 Arg/mes",
    descripcion: "Ideal para abogados en ejercicio o estudios pequeños",
    beneficios: [
      "Accedé a toda la potencia de Dictum IA, diseñada para profesionales del derecho argentino.",
      "Atención prioritaria",
      "Actualizaciones automáticas",
    ],
    boton: "Unirme al plan Premium",
    destacado: true,
  },
  {
    nombre: "Estudio Pro",
    precio: "$200.000 Arg/mes",
    descripcion: "Para equipos legales con alto volumen de trabajo",
    beneficios: [
      "Hasta 5 cuentas activas por estudio",
      "Consultas ilimitadas con IA legal",
      "Generación masiva de contratos",
      "Atención prioritaria dedicada",
      "Soporte personalizado con seguimiento",
    ],
    boton: "Contactar para acceder",
  },
];

function Precios() {
  const navigate = useNavigate();

  const handlePago = async (plan) => {
    try {
      const res = await fetch("https://chatbotabogado.onrender.com/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          description: `Plan ${plan.nombre}`,
        price: plan.nombre === "Premium" ? 35000 : 200000,
        quantity: 1,
        }),
      });

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("⚠️ No se pudo generar el enlace de pago.");
      }
    } catch (error) {
      console.error("❌ Error al iniciar el pago:", error);
      alert("Error al conectar con MercadoPago.");
    }
  };

  return (
    <ContentCard>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#fff", fontWeight: "bold", mb: -6 }}
      >
        Planes y Precios
      </Typography>

      <Typography
        align="center"
        sx={{
          color: "#ccc",
          mb: 4,
          fontSize: { xs: "1rem", md: "1.1rem" },
          maxWidth: "700px",
          mx: "auto",
        }}
      >
        
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="stretch"
        gap={{ xs: 3, md: 4 }}
        sx={{
          width: "100%",
          maxWidth: "1550px",
          mx: "auto",
        }}
      >
        {planes.map((plan, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#1e1e1e",
              color: "#fff",
              borderRadius: 3,
              flex: "1 1 300px",
              minWidth: "280px",
              maxWidth: "360px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 2,
              border: plan.nombre === "Premium" ? "2px solid #0a84ff" : "1px solid #333",
            }}
          >
            <CardContent sx={{flexGrow:1}}>
              {plan.destacado && (
                <Box
                  sx={{
                    backgroundColor: "#0a84ff",
                    color: "#fff",
                    px: 0.5,
                    py: 0.5,
                    fontSize: "0.60rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: "8px",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Más elegido
                </Box>
              )}
              
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
             
              
            </CardContent>

             <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (plan.nombre === "Gratis") navigate("/register");
                  else if (plan.nombre === "Premium" || plan.nombre === "Estudio Pro") handlePago(plan);
                }}
                sx={{
                  mt: 2,
                  backgroundColor: "#0a84ff",
                  ":hover": { backgroundColor: "#0069d9" },
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}
              >
                {plan.boton}
              </Button>


          </Card>
          
        ))}
        
      </Box>
      
    </ContentCard>
    
  );
}

export default Precios;
