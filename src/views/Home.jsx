import {Grid, Button, Typography, Container, IconButton} from '@mui/material';
import {Box} from '@mui/system';
import MediaTable from '../components/MediaTable';
import {Link} from 'react-router-dom';
import {useContext, useEffect, useRef, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useMedia} from '../hooks/ApiHooks';
import {KeyboardArrowDownRounded} from '@mui/icons-material';

const Home = () => {
  const {user, setUser} = useContext(MediaContext);
  const {getAllMediaById} = useMedia();

  const [hasPictures, setHasPictures] = useState(false);

  // checks for user and if null gets user information from localstorage
  const [userData, setData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

  const discover = useRef();

  // when userData changes, saves userData to localstorage and updates userData
  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, [setData]);

  const fetchMedia = async () => {
    try {
      if (!userData) {
        return;
      }
      const media = await getAllMediaById(userData.user_id);
      media.length > 1 ? setHasPictures(true) : setHasPictures(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <>
      <Box
        sx={{
          pt: {xs: '4rem', sm: '2rem'},
          pb: '1rem',
          backgroundColor: '#E3A7B6',
          display: hasPictures ? 'none' : 'flex',
        }}
      >
        <Container
          component="section"
          maxWidth="lg"
          sx={{px: {xs: 3, sm: 'auto'}}}
        >
          <Grid
            container
            columnSpacing={{xs: 1, sm: 2, md: 3}}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={5} md={5}>
              <Box sx={{mx: 'auto'}}>
                <img
                  src={'onlycats_illustration1.png'}
                  alt={'Cat illustration'}
                  loading="lazy"
                  width="100%"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: '25px',
                  backgroundColor: '#FDF7F4',
                  boxShadow: 3,
                  p: 3.5,
                  mx: 'auto',
                  maxWidth: '22rem',
                }}
              >
                <Typography
                  component="h1"
                  variant="h1"
                  textAlign="center"
                  sx={{mb: 3.5}}
                >
                  {user
                    ? 'Ready to show off your cat friend?'
                    : 'Share and discover cat photos and videos.'}
                </Typography>
                <Typography component="p" textAlign="center" sx={{mb: 3.5}}>
                  {user
                    ? 'Share your favorite cat moments with our community of cat lovers by uploading photos and videos.'
                    : 'Join our community and connect with fellow cat lovers.'}
                </Typography>
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to={user ? '/upload' : '/login'}
                    state={true}
                    sx={{mb: 1}}
                  >
                    {user ? 'Add post' : 'Register'}
                  </Button>
                </Box>
                {!user && (
                  <Typography component="p" textAlign="center">
                    Already have an account?{' '}
                    <Button
                      sx={{fontWeight: 600}}
                      variant="text"
                      component={Link}
                      to="/login"
                    >
                      Log in
                    </Button>
                  </Typography>
                )}
              </Box>
              <Box textAlign="center" sx={{display: {xs: 'block', md: 'none'}}}>
                <Typography
                  component="p"
                  variant="body2"
                  textAlign="center"
                  sx={{mt: 3.5}}
                >
                  Or start discovering cats!
                </Typography>
                <IconButton
                  aria-label="Go to Discover cats"
                  size="large"
                  onClick={() => {
                    discover.current.scrollIntoView({behavior: 'smooth'});
                  }}
                >
                  <KeyboardArrowDownRounded />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          pt: {xs: '4rem', sm: '2rem'},
          pb: '2rem',
          px: {xs: 3, sm: 'auto'},
          backgroundColor: '#E3A7B6',
          flexDirection: {xs: 'column', sm: 'column'},
          display: hasPictures ? {xs: 'flex', sm: 'flex'} : 'none',
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{flexDirection: {xs: 'column-reverse', sm: 'row'}}}
        >
          <Box
            sx={{
              maxWidth: '200px',
              px: {xs: 0, sm: '0.5rem'},
            }}
          >
            <img
              src={'onlycats_illustration1.png'}
              alt={'Cat illustration'}
              loading="lazy"
              width="100%"
            />
          </Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              display: {xs: 'none', sm: 'block'},
              fontSize: '3rem',
              px: {xs: 0, sm: '0.5rem'},
            }}
          >
            OnlyCats
          </Typography>
        </Box>
        <Box>
          <Typography
            component="h2"
            variant="h6"
            sx={{fontSize: {xs: '1rem', sm: '1.3rem', textAlign: 'center'}}}
          >
            Share and discover cat photos and videos
          </Typography>
        </Box>
      </Box>

      <Grid component="section" sx={{pt: '3rem', mb: '3rem'}} ref={discover}>
        <MediaTable />
      </Grid>
    </>
  );
};

export default Home;
