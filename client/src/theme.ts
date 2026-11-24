import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#e8f1fd', dark: '#1565c0' },
    secondary: { main: '#455a64' },
    background: { default: '#f0f2f5', paper: '#ffffff' },
    text: { primary: '#263238', secondary: '#607d8b' },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
    h2: { fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.4 },
    h3: { fontSize: '0.95rem', fontWeight: 600 },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true, disableFocusRipple: true } },
    MuiChip: { styleOverrides: { label: { fontSize: '0.8125rem' } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});
