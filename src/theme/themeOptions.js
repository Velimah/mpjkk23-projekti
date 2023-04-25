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
    blackMedium: {
      main: 'rgba(35, 32, 32, 0.6)',
    },
    white: {
      main: '#FDF7F4',
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
    h3: {
      fontFamily: 'Nunito',
      fontSize: '1.4rem',
      fontWeight: 'bold',
    },
    h4: {
      fontFamily: 'Nunito',
      fontSize: '1.3rem',
      fontWeight: 'bold',
    },
    h5: {
      fontFamily: 'Nunito',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily: 'Nunito',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    body1: {
      fontFamily: 'Nunito',
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Nunito',
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Nunito',
          borderRadius: 25,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#FDF7F4',
        },
      },
    },
  },
};

export {themeOptions};
