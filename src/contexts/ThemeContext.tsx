import React, { createContext, useContext, useState } from 'react';
import { createTheme, Theme } from '@mui/material';

interface ThemeContextType {
  currentTheme: Theme;
  isAnimalTheme: boolean;
  toggleTheme: () => void;
}

const defaultTheme = createTheme({
  typography: {
    fontFamily: "'M PLUS Rounded 1c', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '8px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

const animalTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#66BB6A',
      light: '#98EE99',
      dark: '#338A3E',
    },
    secondary: {
      main: '#FFB74D',
      light: '#FFE97D',
      dark: '#C88719',
    },
    background: {
      default: '#E8F5E9',
      paper: '#FFFFFF',
    },
  },
});

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: defaultTheme,
  isAnimalTheme: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAnimalTheme, setIsAnimalTheme] = useState(false);

  const toggleTheme = () => {
    setIsAnimalTheme(!isAnimalTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: isAnimalTheme ? animalTheme : defaultTheme,
        isAnimalTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 