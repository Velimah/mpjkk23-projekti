import React, {useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Paper,
} from '@mui/material';
import {
  AddCircleOutlineRounded,
  HomeRounded,
  SearchRounded,
  FavoriteRounded,
  PersonRounded,
  LoginRounded,
} from '@mui/icons-material';

const loggedNavLinks = [
  {page: 'Liked', to: '/liked', icon: <FavoriteRounded />},
  {page: 'Profile', to: '/profile', icon: <PersonRounded />},
];

const MobileNavigation = () => {
  const {user} = useContext(MediaContext);
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      {(location.pathname === '/home' || location.pathname === '/profile') &&
        user && (
          <Fab
            color="secondary"
            variant="extended"
            component={Link}
            to="/upload"
            style={{
              margin: 0,
              top: 'auto',
              right: '1rem',
              bottom: 72,
              left: 'auto',
              position: 'fixed',
            }}
          >
            <AddCircleOutlineRounded sx={{mr: 1}} />
            Upload
          </Fab>
        )}
      <Paper
        sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1}}
        elevation={4}
      >
        <BottomNavigation showLabels as="nav">
          <BottomNavigationAction
            label="Home"
            icon={<HomeRounded />}
            component={Link}
            to="/home"
            className={location.pathname === '/home' ? 'Mui-selected' : ''}
          />
          <BottomNavigationAction
            label="Search"
            icon={<SearchRounded />}
            component={Link}
            to="/search"
            className={location.pathname === '/search' ? 'Mui-selected' : ''}
          />
          {user ? (
            loggedNavLinks.map((link) => (
              <BottomNavigationAction
                key={link.page}
                label={link.page}
                icon={link.icon}
                component={Link}
                to={link.to}
                className={location.pathname === link.to ? 'Mui-selected' : ''}
              />
            ))
          ) : (
            <BottomNavigationAction
              label="Login"
              icon={<LoginRounded />}
              component={Link}
              to="/"
              className={location.pathname === '/' ? 'Mui-selected' : ''}
            />
          )}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default MobileNavigation;