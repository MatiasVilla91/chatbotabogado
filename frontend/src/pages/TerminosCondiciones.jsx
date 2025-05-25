// src/pages/TerminosCondiciones.jsx
import { Container, Typography, Box } from "@mui/material";

function TerminosCondiciones() {
  return (
    <Box sx={{ backgroundColor: "#111", minHeight: "100vh", py: 1 }}>
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ color: "#fff"}}>
          Términos y Condiciones
        </Typography>

        <Typography variant="body1" sx={{ color: "#ccc", mb: 3 }}>
          Al utilizar Dictum IA, usted acepta los siguientes términos que regulan el acceso y uso del servicio. Este documento constituye un acuerdo legal entre usted y los desarrolladores de la plataforma.
        </Typography>

        <Box sx={{ color: "#ccc", lineHeight: 1.7, fontSize: "0.95rem" }}>
          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            1. Aceptación
          </Typography>
          El uso de Dictum IA implica la aceptación plena de estos términos. Si no está de acuerdo con alguno de ellos, debe abstenerse de usar la plataforma.

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            2. Funcionalidad del Servicio
          </Typography>
          Dictum IA es una herramienta automatizada de asistencia legal. No reemplaza el asesoramiento jurídico profesional. El usuario es responsable del uso que haga de las respuestas brindadas por la IA.

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            3. Planes y Límite de Uso
          </Typography>
          Los planes están sujetos a políticas de uso justo. En caso de uso excesivo o automatizado, nos reservamos el derecho a limitar, suspender o cancelar el acceso al servicio.

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            4. Propiedad Intelectual
          </Typography>
          Todo el contenido, marca, código fuente y diseño de Dictum IA es propiedad intelectual del desarrollador. Está prohibida la reproducción, modificación o distribución sin autorización.

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            5. Exclusión de Responsabilidad
          </Typography>
          Dictum IA se brinda “tal cual”. No garantizamos resultados específicos ni asumimos responsabilidad por decisiones legales tomadas basadas en nuestras respuestas.

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            6. Cambios en los Términos
          </Typography>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán informados en esta misma página. El uso continuado implica su aceptación.

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#fff" }}>
            7. Contacto
          </Typography>
          Para consultas, escribinos a <a href="mailto:contacto@dictumia.com" style={{ color: "#0a84ff" }}>contacto@dictumia.com</a>
        </Box>
      </Container>
    </Box>
  );
}

export default TerminosCondiciones;
