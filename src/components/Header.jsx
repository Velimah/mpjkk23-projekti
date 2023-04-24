import {useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Box,
  Typography,
  useMediaQuery,
  Avatar,
  Tooltip,
} from '@mui/material';
import {PersonRounded} from '@mui/icons-material';

const Header = () => {
  const {user} = useContext(MediaContext);
  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );
  const location = useLocation();

  return (
    <AppBar
      elevation={extraSmallScreen ? 0 : 6}
      position={extraSmallScreen ? 'absolute' : 'sticky'}
      color={extraSmallScreen ? 'transparent' : 'white'}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{justifyContent: {xs: 'center'}}} disableGutters>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <img
              src="/onlycats_logo.png"
              style={{display: 'flex', marginRight: 8, width: 45}}
              alt="OnlyCats logo"
            />
            <Typography
              variant="h1"
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
          <Box sx={{flexGrow: 1, display: {xs: 'none', sm: 'flex'}}}>
            <Box as="nav" sx={{flexGrow: 1}}>
              <Button
                color={
                  location.pathname === '/home' ? 'primary' : 'blackMedium'
                }
                sx={{mr: 1}}
                component={Link}
                to="/home"
              >
                Home
              </Button>
              <Button
                color={
                  location.pathname === '/search' ? 'primary' : 'blackMedium'
                }
                sx={{mr: 1}}
                component={Link}
                to="/search"
              >
                Search
              </Button>
              {user && (
                <Button
                  color={
                    location.pathname === '/liked' ? 'primary' : 'blackMedium'
                  }
                  sx={{mr: 1}}
                  component={Link}
                  to="/liked"
                >
                  Liked
                </Button>
              )}
            </Box>
            {user ? (
              <>
                <Tooltip title="Profile">
                  <Avatar
                    aria-label="Profile"
                    component={Link}
                    to="/profile"
                    sx={{mr: 1}}
                  >
                    <PersonRounded />
                  </Avatar>
                </Tooltip>
                <Button variant="contained" component={Link} to="/upload">
                  Upload
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" component={Link} to="/">
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;