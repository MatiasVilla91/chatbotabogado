import { Box, TextField, Button, Typography } from "@mui/material";

function ContratoForm() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Generar Contrato
      </Typography>
      <TextField
        fullWidth
        label="Nombre del Cliente"
        sx={{ my: 2 }}
      />
      <TextField
        fullWidth
        label="Monto"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Cláusulas especiales"
        multiline
        rows={4}
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        Generar
      </Button>
    </Box>
  );
}

export default ContratoForm;
