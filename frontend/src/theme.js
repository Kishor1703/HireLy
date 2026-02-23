import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1565c0',
            dark: '#0d47a1',
            light: '#42a5f5'
        },
        info: {
            main: '#e3f2fd'
        },
        secondary: {
            main: '#1e88e5',
            midNightBlue: '#0b3d91'
        },
        background: {
            default: '#f4f8ff',
            paper: '#ffffff'
        },
        text: {
            primary: '#0b1f3a',
            secondary: '#3f5e8a'
        }
    },
    shape: {
        borderRadius: 10
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #dbe9ff',
                    boxShadow: '0 8px 20px rgba(13, 71, 161, 0.08)'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1565c0'
                }
            }
        }
    }
});
