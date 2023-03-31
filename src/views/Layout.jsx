import {Link, Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';
import {useContext, useEffect} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {
  Button,
  createTheme,
  Grid,
  ThemeProvider,
  Typography,
} from '@mui/material';
import {themeOptions} from '../theme/themeOptions';
import {Box} from '@mui/system';

const Layout = () => {
  const {user, setUser} = useContext(MediaContext);
  const {getUserByToken} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      console.log(userToken);
      const userData = await getUserByToken(userToken);
      if (userData) {
        setUser(userData);
        const target = location.pathname === '/' ? '/home' : location.pathname;
        navigate(target);
        return;
      }
    }
    navigate('/');
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <Box component="nav" sx={{maxWidth: 'sm', margin: 'auto'}}>
        <Grid container justifyContent="center" sx={{mt: 2}}>
          <Grid item xs={4} textAlign="center">
            <Button component={Link} to="/home" size="large">
              Home
            </Button>
          </Grid>
          {user ? (
            <>
              <Grid item xs={4} textAlign="center">
                <Button component={Link} to="/profile" size="large">
                  Profile
                </Button>
              </Grid>
              <Grid item xs={4} textAlign="center">
                <Button component={Link} to="/logout" size="large">
                  Logout
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={4} textAlign="center">
              <Button component={Link} to="/" size="large">
                Login
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
      <main>
        <Outlet />
      </main>
    </ThemeProvider>
  );
};

export default Layout;
