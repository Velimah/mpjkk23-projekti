import {useContext} from 'react';
import PropTypes from 'prop-types';
import {Link, useLocation} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {PetsRounded} from '@mui/icons-material';
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
      color="white"
    >
      <Container maxWidth="lg">
        <Toolbar sx={{justifyContent: 'space-between'}} disableGutters>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <PetsRounded sx={{display: 'flex', mr: 1}} />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/home"
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
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
