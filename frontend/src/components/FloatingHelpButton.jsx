// components/FloatingHelpButton.jsx
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function FloatingHelpButton() {
  return (
    <Tooltip title="Usar Dictum en Whatsapp" arrow>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#0a84ff',
          '&:hover': {
            backgroundColor: '#006fdd',
          },
          zIndex: 1000,
        }}
        onClick={() => {
          window.open("https://wa.me/5493572500068?text=Hola%20necesito%20ayuda%20con%20Dictum%20IA", "_blank");
        }}
      >
        <WhatsAppIcon />
      </Fab>
    </Tooltip>
  );
}

export default FloatingHelpButton;
