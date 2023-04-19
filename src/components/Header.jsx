import {useContext} from 'react';
import PropTypes from 'prop-types';
import {Link, useLocation} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {useWindowSize} from '../hooks/WindowHooks';
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';

const Header = ({navUnLogged, navLogged}) => {
  const {user} = useContext(MediaContext);
  const windowSize = useWindowSize();
  const location = useLocation();
  return (
    <AppBar
      position={windowSize.width > 658 ? 'sticky' : 'absolute'}
      elevation={windowSize.width > 658 ? 6 : 0}
      color="white"
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={
            windowSize.width > 658
              ? {justifyContent: 'space-between'}
              : {justifyContent: 'center'}
          }
          disableGutters
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <img
              src="./public/onlycats_logo.png"
              style={{display: 'flex', marginRight: 8, width: 45}}
              alt="OnlyCats logo"
            />
            <Typography
              variant="h4"
              noWrap
              component={Link}
              to="/home"
              sx={{
                mr: 2,
                display: 'flex',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              OnlyCats
            </Typography>
          </Box>
          {windowSize.width > 658 && (
            <Box as="nav">
              {user
                ? navLogged.map((link) => (
                    <Button
                      key={link.page}
                      color={
                        location.pathname === '/' + link.to
                          ? 'primary'
                          : 'black'
                      }
                      sx={{mr: 1}}
                      component={Link}
                      to={link.to}
                    >
                      {link.icon}
                      {link.page}
                    </Button>
                  ))
                : navUnLogged.map((link) => (
                    <Button
                      key={link.page}
                      color={
                        location.pathname === '/' + link.to
                          ? 'primary'
                          : 'black'
                      }
                      sx={{mr: 1}}
                      component={Link}
                      to={link.to}
                    >
                      {link.icon}
                      {link.page}
                    </Button>
                  ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

Header.propTypes = {navUnLogged: PropTypes.array, navLogged: PropTypes.array};

export default Header;
