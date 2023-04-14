import {Avatar, Box, Button, Grid, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';

const Profile = () => {
  const {user} = useContext(MediaContext);

  const [avatar, setAvatar] = useState({
    filename: 'https://placekitten.com/320',
  });

  const {getTag} = useTag();
  const navigate = useNavigate();

  const fetchAvatar = async () => {
    try {
      if (user) {
        const avatars = await getTag('avatar_' + user.user_id);
        const ava = avatars.pop();
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
              Profile
            </Typography>
            <Grid container justifyContent="center">
              <Grid item sx={{px: 3}}>
                <Avatar
                  src={avatar.filename}
                  alt="Logo"
                  sx={{
                    borderRadius: 10,
                    boxShadow: 3,
                    width: 320,
                    height: 320,
                  }}
                />
              </Grid>
              <Grid item sx={{px: 3}}>
                <Typography component="h1" variant="h3" sx={{mt: 4}}>
                  <strong>{user.username}</strong>
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong>Full name : </strong>{' '}
                  {user.full_name ? user.full_name : 'Has not set a full name'}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong>Email : </strong> {user.email}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong> User ID : </strong> {user.user_id}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{mt: 5}}
                  onClick={() => navigate(-1)}
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

export default Profile;
