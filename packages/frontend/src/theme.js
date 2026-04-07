import { createTheme } from '@mui/material/styles';

// Theme for Color Fill game
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9fa8f4',
      dark: '#3f50b5',
    },
    secondary: {
      main: '#764ba2',
      light: '#a778d4',
      dark: '#4a2472',
    },
    success: {
      // Used by the win-state banner
      main: '#2e7d32',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      // Slightly warm off-white keeps the game board from feeling sterile
      default: '#f0f2f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 700,
    },
    body2: {
      fontWeight: 500,
    },
  },
  components: {
    // Consistent surface styling for all game panels
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    // Buttons: no uppercase, rounded, medium weight
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
