import {
  Avatar,
  Box,
  Button,
  Container,
  Rating,
  Typography,
} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useMedia, useRating, useTag} from '../hooks/ApiHooks';
import {
  appId,
  filePlaceholder,
  mediaUrl,
  profilePlaceholder,
} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import MediaTable from '../components/MediaTable';
import {StarOutlineRounded, StarRounded} from '@mui/icons-material';

const Profile = () => {
  const {user, setUser, refreshPage} = useContext(MediaContext);
  const {getTag} = useTag();
  const {getRatingsById} = useRating();
  const {getAllMediaByCurrentUser} = useMedia();
  const navigate = useNavigate();

  // useStates
  const [profilePic, setProfilePic] = useState({
    filename: profilePlaceholder,
  });
  const [backgroundPic, setBackgroundPic] = useState({
    filename: filePlaceholder,
  });
  const [profileDescription, setprofileDescription] = useState(
    'No profile text yet!'
  );
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  // checks for user and if null gets user information from localstorage
  const [userData, setData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

  // when UserData changes, saves UserData to localstorage and updates UserData
  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, [setData]);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchProfilePicture = async () => {
    try {
      const profilePictures = await getTag(
        appId + '_profilepicture_' + userData.user_id
      );
      const profilePicture = profilePictures.pop();
      profilePicture.filename = mediaUrl + profilePicture.filename;
      setProfilePic(profilePicture);
    } catch (error) {
      if (error.message === 'Tag not found') {
        setProfilePic({
          filename: profilePlaceholder,
        });
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  const fetchBackgroundPicture = async () => {
    try {
      const backgroundPictures = await getTag(
        appId + '_backgroundpicture_' + userData.user_id
      );
      const backgroundPicture = backgroundPictures.pop();
      backgroundPicture.filename = mediaUrl + backgroundPicture.filename;
      setBackgroundPic(backgroundPicture);
    } catch (error) {
      if (error.message === 'Tag not found') {
        setBackgroundPic({
          filename: filePlaceholder,
        });
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  const fetchProfileDescription = async () => {
    try {
      const profilePictures = await getTag(
        appId + '_profilepicture_' + userData.user_id
      );
      const profileText = profilePictures.pop();
      setprofileDescription(profileText.description);
    } catch (error) {
      if (error.message === 'Tag not found') {
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  const fetchAllRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      const mediaInfo = await getAllMediaByCurrentUser(token);
      let sum = 0;
      let count = 0;
      for (const file of mediaInfo) {
        await sleep(20);
        const ratings = await getRatingsById(file.file_id);
        if (ratings.length !== 0) {
          for (const obj of ratings) {
            sum += obj.rating;
            count++;
          }
        }
      }
      setRatingCount(count);
      let average = sum / count;
      if (isNaN(average)) {
        average = 0;
      }
      setRating(average);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
    fetchBackgroundPicture();
    fetchProfileDescription();
    fetchAllRatings();
  }, [userData, refreshPage]);

  return (
    <>
      <Container maxWidth="lg" sx={{pt: {xs: 7, sm: '3rem'}, px: 0}}>
        <Avatar
          src={backgroundPic.filename}
          alt="Logo"
          sx={{
            borderRadius: {xs: 0, sm: '2rem'},
            boxShadow: 3,
            width: '100%',
            height: {xs: '200px', md: '300px'},
            maxHeight: '300px',
          }}
        />
        <Avatar
          src={profilePic.filename}
          alt="Logo"
          sx={{
            boxShadow: 3,
            borderStyle: 'solid',
            borderColor: '#FFFFFF',
            borderWidth: '2px',
            position: 'relative',
            height: {xs: '100px', sm: '125px', md: '150px'},
            width: {xs: '100px', sm: '125px', md: '150px'},
            top: {xs: '-60px', sm: '-64px', md: '-80px'},
            left: '20px',
          }}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            maxWidth: 'lg',
            width: '100%',
            mt: {xs: '-48px', sm: '-56px', md: '-56px'},
            px: 4,
            pt: {xs: 2, md: 0},
            flexDirection: {xs: 'row', sm: 'row'},
          }}
        >
          <Box display="flex" flexDirection="column" textAlign="start">
            <Typography component="h1" variant="h1">
              {userData.full_name
                ? userData.full_name
                : 'You have not set a full name'}
            </Typography>
            <Typography component="p" variant="body1" sx={{mt: 0.5}}>
              {'@' + userData.username}
            </Typography>
            <Rating
              name="read-only"
              size="large"
              precision={0.5}
              value={Number(rating.toFixed(2))}
              icon={<StarRounded sx={{fontSize: '1.8rem'}} />}
              emptyIcon={<StarOutlineRounded sx={{fontSize: '1.8rem'}} />}
              readOnly
              sx={{mt: 1, color: '#7047A6', ml: -0.5}}
            />
            <Typography component="legend" variant="caption">
              {rating.toFixed(2)} ({ratingCount} ratings)
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            sx={{
              width: '124px',
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{
                mr: {xs: 0, sm: 0},
              }}
              onClick={() => navigate('/profile/update')}
            >
              Settings
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{mt: 2, mr: {xs: 0, sm: 0}}}
              onClick={() => navigate('/logout')}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{}}
        >
          <Typography
            component="p"
            variant="body1"
            sx={{maxWidth: 'sm', pb: 4, pt: {xs: 6, md: 2}, px: 4}}
          >
            {profileDescription}
          </Typography>
        </Box>
      </Container>
      <Container sx={{px: 0, pb: {xs: '3.5rem'}}}>
        <MediaTable myFilesOnly={true} />
      </Container>
    </>
  );
};

export default Profile;
