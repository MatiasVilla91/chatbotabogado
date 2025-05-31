import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a84ff',
    },
    secondary: {
      main: '#5e5e5e',
    },
    background: {
      default: '#121212',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a3a3a3',
    },
  },
  typography: {
    fontFamily: 'Inter, san-serif',
    h4: {
      fontWeight: 900,
      color: '#eeeee',
      letterSpacing: '0.5px',
      textAlign: 'center',
      marginBottom: '1em',
    },
    body1: {
      lineHeight: 1.6,
      color: '#e0e0e0', //color tipografia principal
    },
    button: {
      textTransform: 'none',
      fontWeight: 900,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
        },
      },
    },
    MuiAppBar: { 
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 18, 0.8)',   //navbar color
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '3em',
          borderRadius: '50px',
          backgroundColor: '#transparent', 
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1.5em',
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#3a3a3a',
            },
            '&:hover fieldset': {
              borderColor: '#0a84ff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0a84ff',
              boxShadow: '0 0 6px rgba(10, 132, 255, 0.4)',
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
            backgroundColor: '#006fdd',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    
  },
});

export default theme;
