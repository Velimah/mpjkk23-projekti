import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Paper,
  useMediaQuery,
} from '@mui/material';
import {
  HomeRounded,
  SearchRounded,
  FavoriteRounded,
  PersonRounded,
  LoginRounded,
  AddRounded,
  QuestionAnswerRounded,
} from '@mui/icons-material';

const loggedNavLinks = [
  {page: 'Liked', to: '/liked', icon: <FavoriteRounded />},
  {page: 'CatGPT', to: '/catgpt', icon: <QuestionAnswerRounded />},
  {page: 'Profile', to: '/profile', icon: <PersonRounded />},
];

const MobileNavigation = () => {
  const {user} = useContext(MediaContext);

  const location = useLocation();
  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, []);

  const listenToScroll = () => {
    const heightToShowFrom = 150;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll < heightToShowFrom) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  return (
    <>
      {extraSmallScreen && (
        <>
          {(location.pathname === '/' ||
            location.pathname === '/profile' ||
            location.pathname === '/liked') &&
            user && (
              <Fab
                color="secondary"
                variant="extended"
                component={Link}
                to="/upload"
                style={{
                  margin: 0,
                  top: 'auto',
                  right: 24,
                  bottom: 80,
                  left: 'auto',
                  position: 'fixed',
                  display: location.pathname === '/' && !visible && 'none',
                }}
              >
                <AddRounded sx={{mr: 1}} />
                Add post
              </Fab>
            )}
          <Paper
            sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50}}
            elevation={4}
          >
            <BottomNavigation showLabels as="nav">
              <BottomNavigationAction
                label="Home"
                icon={<HomeRounded />}
                component={Link}
                to="/"
                className={location.pathname === '/' ? 'Mui-selected' : ''}
              />
              <BottomNavigationAction
                label="Search"
                icon={<SearchRounded />}
                component={Link}
                to="/search"
                className={
                  location.pathname === '/search' ? 'Mui-selected' : ''
                }
              />
              {user ? (
                loggedNavLinks.map((link) => (
                  <BottomNavigationAction
                    key={link.page}
                    label={link.page}
                    icon={link.icon}
                    component={Link}
                    to={link.to}
                    className={
                      location.pathname === link.to ? 'Mui-selected' : ''
                    }
                  />
                ))
              ) : (
                <BottomNavigationAction
                  label="Login"
                  icon={<LoginRounded />}
                  component={Link}
                  to="/login"
                  className={
                    location.pathname === '/login' ? 'Mui-selected' : ''
                  }
                />
              )}
            </BottomNavigation>
          </Paper>
        </>
      )}
    </>
  );
};

export default MobileNavigation;
