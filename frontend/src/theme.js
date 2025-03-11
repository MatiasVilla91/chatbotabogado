import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d6efd',
    },
    secondary: {
      main: '#6c757d',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#0d6efd',
      letterSpacing: '0.5px',
      textAlign: 'center',
      marginBottom: '1em',
    },
    body1: {
      lineHeight: 1.6,
      color: '#6c757d',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
          maxWidth: '600px',
          margin: 'auto',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#e9ecef',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          padding: '1em',
          backgroundColor: '#f8f9fa',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '0.8em 1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em',
          borderTop: '1px solid #ced4da',
          backgroundColor: '#fff',
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          borderRadius: '8px',
          margin: '0.5em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          flex: 1,
          borderRadius: 12,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ced4da',
            },
            '&:hover fieldset': {
              borderColor: '#0d6efd',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0d6efd',
              boxShadow: '0 0 6px rgba(13, 110, 253, 0.35)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '0.6em 1em',
          textTransform: 'none',
          backgroundColor: '#0d6efd',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0b5ed7',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          padding: '0.8em 1.2em',
          borderRadius: '18px',
          maxWidth: '70%',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
      },
      variants: [
        {
          props: { variant: 'body1', className: 'sent' },
          style: {
            backgroundColor: '#0d6efd',
            color: '#fff',
            alignSelf: 'flex-end',
            borderRadius: '18px 18px 0px 18px',
            marginBottom: '0.5em',
            marginRight: '10px',
            padding: '0.8em 1.2em',
          },
        },
        {
          props: { variant: 'body1', className: 'received' },
          style: {
            backgroundColor: '#f1f3f5',
            color: '#333',
            alignSelf: 'flex-start',
            borderRadius: '18px 18px 18px 0px',
            marginBottom: '0.5em',
            marginLeft: '10px',
            padding: '0.8em 1.2em',
          },
        },
      ],
    },
  },
});

export default theme;
