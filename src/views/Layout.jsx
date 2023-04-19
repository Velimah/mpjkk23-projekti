import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';
import React, {useContext, useEffect} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import {themeOptions} from '../theme/themeOptions';
import {
  FavoriteRounded,
  HomeRounded,
  LoginRounded,
  LogoutRounded,
  PersonRounded,
  SearchRounded,
  AddCircleOutlineRounded,
} from '@mui/icons-material';
import {useWindowSize} from '../hooks/WindowHooks';
import MobileNavigation from '../components/MobileNavigation';
import Header from '../components/Header';

const Layout = () => {
  const {setUser} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useWindowSize();

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      const userData = await getUserByToken(userToken);
      if (userData) {
        setUser(userData);
        const target = location.pathname === '/' ? '/home' : location.pathname;
        navigate(target);
        return;
      }
    }
    navigate('/home');
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const theme = createTheme(themeOptions);

  const navUnLogged = [
    {page: 'Home', to: 'home', icon: <HomeRounded />},
    {page: 'Search', to: 'search', icon: <SearchRounded />},
    {page: 'Login', to: '', icon: <LoginRounded />},
  ];
  // TODO: Remove pages that are not used in nav: my files and logout
  const navLogged = [
    {page: 'Home', to: 'home', icon: <HomeRounded />},
    {page: 'Search', to: 'search', icon: <SearchRounded />},
    {page: 'Upload', to: 'upload', icon: <AddCircleOutlineRounded />},
    {page: 'Liked', to: 'liked', icon: <FavoriteRounded />},
    {page: 'Profile', to: 'profile', icon: <PersonRounded />},
    {page: 'Logout', to: 'logout', icon: <LogoutRounded />},
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/** Css reset/normalize*/}
      <Header navUnLogged={navUnLogged} navLogged={navLogged} />
      <main>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </main>
      {windowSize.width < 659 && (
        <MobileNavigation navUnLogged={navUnLogged} navLogged={navLogged} />
      )}
    </ThemeProvider>
  );
};

export default Layout;
