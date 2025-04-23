// components/FloatingHelpButton.jsx
import { Fab, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function FloatingHelpButton() {
  return (
    <Tooltip title="¿Necesitás ayuda?" arrow>
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
          window.open("https://wa.me/5493510000000?text=Hola%20necesito%20ayuda%20con%20Dictum%20IA", "_blank");
        }}
      >
        <HelpOutlineIcon />
      </Fab>
    </Tooltip>
  );
}

export default FloatingHelpButton;
