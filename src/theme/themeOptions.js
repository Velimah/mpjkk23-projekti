import '@fontsource/roboto';
import '@fontsource/nunito';

const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#7047A6',
    },
    secondary: {
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#7047A6',
          borderRadius: 0,
          width: '150px',
          '&.active': {
            borderBottom: '2px solid #7047A6',
          },
        },
      },
    },
  },
};

export {themeOptions};
