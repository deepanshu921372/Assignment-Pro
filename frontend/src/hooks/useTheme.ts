// frontend/src/hooks/useTheme.ts
import { createTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const useTheme = () => {
  // Initialize the mode state based on localStorage
  const [mode, setMode] = useState<'light' | 'dark'>('dark'); // Default to dark mode

  useEffect(() => {
    const savedMode = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []); 

  
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#ffffff', // Hardcoded light background
              paper: '#f5f5f5',   // Hardcoded light paper
            },
            text: {
              primary: '#000000', // Hardcoded light text color
              secondary: '#555555', // Hardcoded light secondary text color
            },
          }
        : {
            background: {
              default: '#121212', // Hardcoded dark background
              paper: '#1e1e1e',   // Hardcoded dark paper
            },
            text: {
              primary: '#ffffff', // Hardcoded dark text color
              secondary: '#b0b0b0', // Hardcoded dark secondary text color
            },
          }),
    },
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode); 
  };

  return { theme, toggleTheme, mode };
};

export { useTheme };