import {Grid, Button, Typography} from '@mui/material';
import {Box} from '@mui/system';
import MediaTable from '../components/MediaTable';
import {Link} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useMedia} from '../hooks/ApiHooks';

const Home = () => {
  const {user, setUser} = useContext(MediaContext);
  const {getAllMediaById} = useMedia();

  const [hasPictures, setHasPictures] = useState(false);

  // checks for user and if null gets user information from localstorage
  const [userData, setData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

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
      <Grid
        container
        columnSpacing={{xs: 1, sm: 2, md: 3}}
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          py: '60px',
          backgroundColor: '#E3A7B6',
          display: hasPictures ? 'none' : 'flex',
        }}
      >
        <Grid item xs={5}>
          <Box sx={{maxWidth: '500px'}}>
            <img
              src={'onlycats_illustration1.png'}
              alt={'Cat illustration'}
              loading="lazy"
              width="100%"
            />
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              borderRadius: '25px',
              backgroundColor: '#FDF7F4',
              boxShadow: 3,
              p: 4,
              m: '0 1rem',
              maxWidth: '22rem',
            }}
          >
            <Typography
              component="h1"
              variant="h1"
              textAlign="center"
              sx={{mb: 5}}
            >
              {user
                ? 'Ready to show off your cat friend?'
                : 'Share and discover cat photos and videos on OnlyCats.'}
            </Typography>
            <Typography component="p" textAlign="center" sx={{mb: 5}}>
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
        </Grid>
      </Grid>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          pt: {xs: '4rem', sm: '2rem'},
          pb: '2rem',
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
              px: {xs: 0, sm: '1rem'},
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
              px: {xs: 0, sm: '1rem'},
            }}
          >
            OnlyCats
          </Typography>
        </Box>
        <Box>
          <Typography
            component="h2"
            variant="h6"
            sx={{fontSize: {xs: '1rem', sm: '1.2rem'}}}
          >
            Share and discover cat photos and videos
          </Typography>
        </Box>
      </Box>

      <Grid sx={{mt: '3rem', mb: '3rem'}}>
        <MediaTable />
      </Grid>
    </>
  );
};

export default Home;
