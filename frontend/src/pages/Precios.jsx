// src/pages/Precios.jsx
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import ContentCard from "../components/ContentCard";
import { useNavigate } from "react-router-dom";

const planes = [
  {
  nombre: "Plan Gratis",
  precio: "$0",
  descripcion: "Empezá a usar Dictum IA hoy, sin riesgos ni compromiso",
  beneficios: [
    "✅ 5 consultas legales mensuales con IA experta en derecho argentino",
    "⚡ Acceso inmediato sin tarjeta: registrate y usalo al instante",
    "🚀 Revolucioná tu práctica legal con tecnología de punta",
    "⏱️ Respuestas claras en segundos, sin esperas ni turnos",
    "🔒 Máxima privacidad y seguridad en cada consulta",
  ],
  boton: "Acceder gratis ahora",
  destacado: false,
  
  destacadoTexto: "¡Empieza sin pagar!",
},
  {
    nombre: "Premium",
    precio: "$35.000 Arg/mes",
    descripcion: "La elección perfecta para abogados que buscan destacarse",
    beneficios: [
    "✅ Consultas ilimitadas con IA legal entrenada en normativa argentina",
    "🚀 Resolvé casos en menos tiempo y con mayor precisión",
    "📞 Soporte prioritario para que nunca pierdas tiempo valioso",
    "🔔 Alertas legales y actualizaciones automáticas que te mantienen un paso adelante",
    "🧠 Optimizado para profesionales en ejercicio",
    "⌛Ahorra tiempo y descubre solciones en segundos"
    ],
    boton: "Quiero ser Premium",
    destacado: true,
    destacadoTexto: "Ideal para Profesionales",
    
  },
  {
  nombre: "Estudio Pro",
  precio: "$200.000 Arg/mes",
  descripcion: "La solución definitiva para estudios jurídicos con alta demanda",
  beneficios: [
    "👥 Hasta 10 cuentas activas con acceso completo a Dictum IA",
    "🔍 Consultas ilimitadas con IA especializada en derecho argentino",
    "🎯 Soporte premium personalizado con seguimiento estratégico",
    "⚙️ Atención dedicada y herramientas diseñadas para equipos legales de alto rendimiento",
    "📈 Más velocidad, más organización, más resultados",
  ],
  boton: "Solicitar acceso al Plan Pro",
  destacado: false,
  destacadoTexto: "Ideal para estudios jurídicos",
},
];

function Precios() {
  const navigate = useNavigate();

 const handlePago = async (plan) => {
  try {
    const res = await fetch("https://chatbotabogado.onrender.com/pago", {
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

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Error en la respuesta:", text);
      alert("Error inesperado al generar el enlace de pago.");
      return;
    }

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
          fontSize: { xs: "1rem", md: "0.5em" },
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
             {plan.destacadoTexto && (
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
    {plan.destacadoTexto}
  </Box>
)}

              
              <Typography
                variant="h4"
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
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "1.5rem" },
                  lineHeight: 1.1,
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
