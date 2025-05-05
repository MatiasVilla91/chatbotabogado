import { Container, Typography, Box, Divider } from "@mui/material";

function PoliticaPrivacidad() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        Política de Privacidad
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Esta Política de Privacidad describe cómo <strong>[Nombre de la App]</strong> (en adelante, “la Plataforma” o “nosotros”) recopila, utiliza, almacena y protege los datos personales de los usuarios que acceden y utilizan nuestros servicios. Al utilizar la Plataforma, el usuario acepta los términos de esta política.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* 1. Información recopilada */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>1. Información que recopilamos</Typography>
        <Typography variant="body1">
          Podemos recolectar los siguientes tipos de información:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
          <li><Typography variant="body2">Datos de identificación: nombre completo, dirección de correo electrónico, número de teléfono, etc.</Typography></li>
          <li><Typography variant="body2">Datos de navegación: dirección IP, tipo de navegador, sistema operativo, páginas visitadas, duración de la visita, etc.</Typography></li>
          <li><Typography variant="body2">Datos proporcionados por el usuario de forma voluntaria, como consultas, solicitudes o comentarios.</Typography></li>
        </Box>
      </Box>

      {/* 2. Finalidades del tratamiento */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>2. Finalidades del tratamiento</Typography>
        <Typography variant="body1">
          Utilizamos la información recopilada con las siguientes finalidades:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
          <li><Typography variant="body2">Gestionar el registro y acceso del usuario a la Plataforma.</Typography></li>
          <li><Typography variant="body2">Mejorar el funcionamiento y la experiencia de uso de nuestros servicios.</Typography></li>
          <li><Typography variant="body2">Enviar notificaciones informativas y promocionales, cuando corresponda y haya consentimiento.</Typography></li>
          <li><Typography variant="body2">Cumplir con obligaciones legales o requerimientos judiciales.</Typography></li>
        </Box>
      </Box>

      {/* 3. Conservación de los datos */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>3. Conservación de los datos</Typography>
        <Typography variant="body1">
          Los datos personales serán conservados durante el tiempo que sea necesario para cumplir con las finalidades para las que fueron recopilados y/o mientras exista una obligación legal o contractual.
        </Typography>
      </Box>

      {/* 4. Medidas de seguridad */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>4. Seguridad de la información</Typography>
        <Typography variant="body1">
          Implementamos medidas técnicas y organizativas adecuadas para garantizar la confidencialidad, integridad y disponibilidad de los datos personales. No obstante, ningún sistema es completamente infalible y el usuario asume ciertos riesgos al utilizar servicios digitales.
        </Typography>
      </Box>

      {/* 5. Cookies */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>5. Cookies y tecnologías similares</Typography>
        <Typography variant="body1">
          La Plataforma puede utilizar cookies propias y de terceros para mejorar la experiencia del usuario, analizar el tráfico web y personalizar contenido. El usuario puede configurar su navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades.
        </Typography>
      </Box>

      {/* 6. Derechos del usuario */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>6. Derechos del usuario</Typography>
        <Typography variant="body1">
          El usuario podrá ejercer los derechos de acceso, rectificación, actualización, supresión, oposición y limitación del tratamiento de sus datos personales, conforme a la normativa vigente. Para ello, podrá contactarnos mediante correo electrónico a: <strong>contacto@tudominio.com</strong>
        </Typography>
      </Box>

      {/* 7. Modificaciones */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>7. Modificaciones a esta política</Typography>
        <Typography variant="body1">
          Nos reservamos el derecho a modificar la presente Política de Privacidad en cualquier momento. Los cambios serán publicados en esta misma sección, y se entenderá que el usuario acepta la nueva versión si continúa utilizando la Plataforma.
        </Typography>
      </Box>

      {/* 8. Contacto */}
      <Box>
        <Typography variant="h5" gutterBottom>8. Contacto</Typography>
        <Typography variant="body1">
          Si tenés consultas o requerís más información sobre el tratamiento de tus datos, podés comunicarte con nosotros escribiendo a <strong>contacto@tudominio.com</strong>.
        </Typography>
      </Box>
    </Container>
  );
}

export default PoliticaPrivacidad;
