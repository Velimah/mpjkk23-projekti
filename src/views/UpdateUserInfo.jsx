import {Avatar, Box, Button, Grid, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import ModifyUserForm from '../components/ModifyUserForm';
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
              <UploadProfilePicture/>
              <UploadProfileBackgroundPicture/>
              <ModifyUserForm />
            </Grid>
            <Grid container justifyContent="center" gap={5}>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{mt: 5}}
                  onClick={() => navigate('/profile')}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Box>

        </>
      )}
    </>
  );
};

export default UpdateUserInfo;
