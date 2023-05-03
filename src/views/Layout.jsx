import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';
import React, {useContext, useEffect} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {themeOptions} from '../theme/themeOptions';
import MobileNavigation from '../components/MobileNavigation';
import Header from '../components/Header';
import ToastSnackbar from '../components/ToastSnackbar';

const Layout = () => {
  const {setUser} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      try {
        const userData = await getUserByToken(userToken);
        if (userData) {
          setUser(userData);
          const target =
            location.pathname === '/login' ? '/' : location.pathname;
          navigate(target);
          return;
        }
      } catch (error) {
        console.error(error.message);
        navigate('/logout');
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/** Css reset/normalize*/}
      <Header />
      <MobileNavigation />
      <main>
        <ToastSnackbar />
        <Outlet />
      </main>
    </ThemeProvider>
  );
};

export default Layout;
