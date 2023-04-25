import {Box, Button, Grid, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useNavigate} from 'react-router-dom';
import UpdateUserForm from '../components/UpdateUserForm';
import UploadProfilePicture from '../components/UploadProfilePicture';
import UploadProfileBackgroundPicture from '../components/UploadProfileBackgroundPicture';

const UpdateUserInfo = () => {
  const {user} = useContext(MediaContext);
  const navigate = useNavigate();

  return (
    <>
      {user && (
        <>
          <Box sx={{maxWidth: 'md', margin: 'auto'}}>
            <Typography
              component="h1"
              variant="h2"
              textAlign="center"
              sx={{my: 6}}
            >
              Update User info
            </Typography>
            <Grid container justifyContent="center">
              <UploadProfileBackgroundPicture />
              <UploadProfilePicture />
              <UpdateUserForm />
            </Grid>
            <Box display="flex" width="100%" justifyContent="center">
              <Button
                variant="contained"
                sx={{m: 5, width: '200px'}}
                onClick={() => navigate('/home')}
              >
                Back
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default UpdateUserInfo;
