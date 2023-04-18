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

  const [avatar, setAvatar] = useState({
    filename: 'https://placekitten.com/320',
  });

  const {getTag} = useTag();
  const navigate = useNavigate();

  const fetchAvatar = async () => {
    try {
      if (user) {
        const avatars = await getTag(appId + '_profilepicture_' + user.user_id);
        const ava = avatars.pop();
        console.log(ava);
        ava.filename = mediaUrl + ava.filename;
        setAvatar(ava);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [user]);

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
          </Box>

        </>
      )}
    </>
  );
};

export default UpdateUserInfo;
