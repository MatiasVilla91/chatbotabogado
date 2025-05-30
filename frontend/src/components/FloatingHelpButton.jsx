// components/FloatingHelpButton.jsx
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/Telegram';

function FloatingHelpButton() {
  return (
    <Tooltip title="Usar Dictum en Telegram" arrow>
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
          window.open("https://t.me/dictum_ia_bot", "_blank");
        }}
      >
        <WhatsAppIcon />
      </Fab>
    </Tooltip>
  );
}

export default FloatingHelpButton;
