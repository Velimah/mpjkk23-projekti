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
    subtitle1: {
      fontFamily: 'Nunito',
    },
    subtitle2: {
      fontFamily: 'Nunito',
    },
    body1: {
      fontFamily: 'Nunito',
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Nunito',
      fontSize: '1.1rem',
    },
    body3: {
      fontFamily: 'Nunito',
      fontSize: '1.2rem',
    },
    body4: {
      fontFamily: 'Nunito',
      fontSize: '1.3rem',
    },
    button: {
      fontFamily: 'Nunito',
    },
    caption: {
      fontFamily: 'Nunito',
    },
    overline: {
      fontFamily: 'Nunito',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Nunito',
          borderRadius: 25,
          paddingTop: 8,
          paddingBottom: 8,
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
          color: '#232020',
          borderRadius: 0,
          '&.active': {
            color: '#7047A6',
            borderBottom: '5px solid #7047A6',
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
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12.5,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12.5,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 25,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12.5,
        },
      },
    },
  },
};

export {themeOptions};
