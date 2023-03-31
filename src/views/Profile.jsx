import {Box, Grid, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';

const Profile = () => {
  const {user} = useContext(MediaContext);

  return (
    <>
      {user && (
        <>
          <Box sx={{maxWidth: 'sm', margin: 'auto', mt: 10}}>
            <Grid container direction={'row'}>
              <div>img</div>
              <Grid container direction={'column'}>
                <Typography component="h1" variant="h3" sx={{mt: 3}}>
                  Profile
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  Username: {user.username}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  Full name: {user.full_name ? user.full_name : 'not found'}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  Email: {user.email}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default Profile;
