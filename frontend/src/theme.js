import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a84ff',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#0f0f0f',
      paper: 'rgba(31, 31, 31, 0.7)',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 900,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 800,
      fontSize: '2rem',
      letterSpacing: '0.5px',
      textAlign: 'center',
      color: '#f8fafc',
    },
    body1: {
      lineHeight: 1.7,
      color: '#e2e8f0',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f0f0f',
          backgroundImage: 'radial-gradient(circle at top left, #111, #0a0a0a)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '0em',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(31, 31, 31, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1e1e1e',
            color: '#fff',
            '& fieldset': {
              borderColor: '#2c2c2c',
            },
            '&:hover fieldset': {
              borderColor: '#0a84ff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0a84ff',
              boxShadow: '0 0 8px rgba(10, 132, 255, 0.5)',
            },
          },
        },
      },
    },


    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '0.8em 1.5em',
          backgroundColor: '#454646',
          color: '#fff',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg,rgb(0, 72, 255) 0%, #2563eb 100%)',
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 6px 20px rgba(10, 132, 255, 0.5)',
          },
        },
      },
    },
    
  


    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#e2e8f0',
        },
      },
    },
  },
});

export default theme;
