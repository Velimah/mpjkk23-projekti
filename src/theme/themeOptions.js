import '@fontsource/nunito';

const themeOptions = {
  palette: {
    type: 'light',
    background: {
      default: '#FDF7F4',
    },
    primary: {
      main: '#7047A6',
    },
    secondary: {
      main: '#ACCC7F',
    },
    black: {
      main: '#232020',
    },
    white: {
      main: '#ACCC7F',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Nunito',
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    h2: {
      fontFamily: 'Nunito',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    body1: {
      fontFamily: 'Nunito',
      fontSize: '16px',
    },
    body2: {
      fontFamily: 'Nunito',
      fontSize: '16px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Nunito',
          borderRadius: 20,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
  },
};

export {themeOptions};
