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
    MuiImageListItem: {
      styleOverrides: {
        root: {
          height: '100%',
          width: '100%',
          transition: '0.3s',
          overflow: 'hidden',
        },
      },
    },
    MuiImageList: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
  },
  breakpoints: {
    values: {
      mobile: 0,
      bigMobile: 350,
      tablet: 650,
      desktop: 900,
    },
  },
};

export {themeOptions};
