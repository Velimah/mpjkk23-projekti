import {Avatar, Box, Button, Grid, Rating, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useMedia, useRating, useTag, useUser} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {useLocation, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';

const UserProfiles = () => {
  const {user} = useContext(MediaContext);
  const {getTag} = useTag();
  const navigate = useNavigate();
  const {getRatingsById} = useRating();
  const {getAllMediaById} = useMedia();
  const {getUser} = useUser();
  const {state} = useLocation();
  const file = state.file;

  const [profilePic, setProfilePic] = useState({
    filename: 'https://placekitten.com/200/200',
  });
  const [backgroundPic, setBackgroundPic] = useState({
    filename: 'https://placekitten.com/800/300',
  });
  const [profileDescription, setprofileDescription] = useState(
    'No profile text yet!'
  );

  const [userData, setUserData] = useState({});
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const fetchUserData = async () => {
    try {
      if (user) {
        const token = localStorage.getItem('token');
        const userData = await getUser(file.user_id, token);
        setUserData(userData);
        console.log(userData);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + file.user_id
        );
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        setProfilePic(profilePicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchBackgroundPicture = async () => {
    try {
      if (user) {
        const backgroundPictures = await getTag(
          appId + '_backgroundpicture_' + file.user_id
        );
        const backgroundPicture = backgroundPictures.pop();
        backgroundPicture.filename = mediaUrl + backgroundPicture.filename;
        setBackgroundPic(backgroundPicture);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProfileDescription = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + file.user_id
        );
        const profileText = profilePictures.pop();
        setprofileDescription(profileText.description);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllRatings();
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchProfilePicture();
    fetchBackgroundPicture();
    fetchProfileDescription();
  }, [user]);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchAllRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      const mediaInfo = await getAllMediaById(file.user_id, token);
      console.log(mediaInfo);
      let sum = 0;
      let count = 0;
      for (const file of mediaInfo) {
        await sleep(100);
        const ratings = await getRatingsById(file.file_id);
        if (ratings.length !== 0) {
          for (const obj of ratings) {
            sum += obj.rating;
            count++;
          }
        }
      }
      setRatingCount(count);
      const average = sum / count;
      setRating(average);
    } catch (error) {
      console.log(error.message);
    }
  };

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
              User profile
            </Typography>
            <Avatar
              src={backgroundPic.filename}
              alt="Logo"
              sx={{
                borderRadius: 0,
                boxShadow: 3,
                width: 900,
                height: 320,
              }}
            />
            <Grid container justifyContent="center">
              <Grid item sx={{px: 3}}>
                <Avatar
                  src={profilePic.filename}
                  alt="Logo"
                  sx={{
                    top: -100,
                    left: -100,
                    boxShadow: 3,
                    width: 200,
                    height: 200,
                    borderStyle: 'solid',
                    borderWidth: 3,
                    borderColor: 'white',
                  }}
                />
              </Grid>
              <Grid item sx={{px: 3}}>
                <Typography component="h1" variant="h3" sx={{mt: 4}}>
                  <strong>{userData.username}</strong>
                </Typography>
                <Box sx={{mt: 1}}>
                  <Rating
                    name="read-only"
                    size="large"
                    precision={0.5}
                    value={parseFloat(rating).toFixed(2)}
                    readOnly
                  />
                  <Typography component="legend">
                    {parseFloat(rating).toFixed(2)} ({ratingCount} ratings)
                  </Typography>
                </Box>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong>Full name : </strong>{' '}
                  {userData.full_name
                    ? userData.full_name
                    : 'Has not set a full name'}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong>Email : </strong> {userData.email}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong> User ID : </strong> {userData.user_id}
                </Typography>
                <Typography component="div" variant="h6" sx={{mt: 3}}>
                  <strong> Description : </strong> {profileDescription}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" gap={5}>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{mt: 5}}
                  onClick={() => navigate('/home')}
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

UserProfiles.propTypes = {
  file: PropTypes.object.isRequired,
};

export default UserProfiles;
