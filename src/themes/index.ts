import { createTheme } from '@mui/material';

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export const animalTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // 緑色
    },
    secondary: {
      main: '#FFA726', // オレンジ色
    },
    background: {
      default: '#E8F5E9', // 薄い緑色
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Mochiy Pop One', 'M PLUS Rounded 1c', sans-serif",
    h3: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h5: {
      fontWeight: 500,
      color: '#1B5E20',
    },
    body1: {
      fontFamily: "'Kosugi Maru', sans-serif",
      fontSize: '1.1rem',
    },
    body2: {
      fontFamily: "'Kosugi Maru', sans-serif",
      fontSize: '1rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'url("/animal-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 16,
          border: '2px solid #4CAF50',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Kosugi Maru', sans-serif",
          borderRadius: 25,
          textTransform: 'none',
          fontSize: '1.1rem',
          padding: '10px 20px',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  },
}); 