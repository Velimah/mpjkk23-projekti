import {useContext, useEffect, useState} from 'react';
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
import {useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const {user} = useContext(MediaContext);
  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );
  const location = useLocation();
  const navigate = useNavigate();

  const {getTag} = useTag();
  const [profilePic, setProfilePic] = useState({
    filename: 'https://placekitten.com/200/200',
  });

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + user.user_id
        );
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        setProfilePic(profilePicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [user]);

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
              src="onlycats_logo.png"
              style={{
                display: 'flex',
                marginRight: 8,
                width: 45,
                cursor: 'pointer',
              }}
              alt="OnlyCats logo"
              onClick={() => navigate('/home')}
            />
            <Typography
              variant="h1"
              noWrap
              component={Link}
              to="/home"
              sx={{
                mr: 2,
                display: {xs: 'flex', sm: 'none', md: 'flex'},
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
                <Tooltip title="Cat-GPT">
                  <Avatar
                    src={'gpt-logo.png'}
                    aria-label="Cat-GPT"
                    component={Link}
                    to="/catgpt"
                    sx={{mr: 1}}
                  >
                    <PersonRounded />
                  </Avatar>
                </Tooltip>
                <Tooltip title="Profile">
                  <Avatar
                    src={profilePic.filename}
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
