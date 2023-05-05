import {Avatar, Box, Container, Rating, Typography} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useState, useEffect} from 'react';
import {useMedia, useRating, useTag, useUser} from '../hooks/ApiHooks';
import {
  appId,
  filePlaceholder,
  mediaUrl,
  profilePlaceholder,
} from '../utils/variables';
import {useLocation} from 'react-router-dom';
import MediaTable from '../components/MediaTable';
import {StarOutlineRounded, StarRounded} from '@mui/icons-material';

const UserProfiles = () => {
  const {user, setTargetUser} = useContext(MediaContext);
  const {getTag} = useTag();
  const {getRatingsById} = useRating();
  const {getAllMediaById} = useMedia();
  const {getUser} = useUser();
  const {state} = useLocation();

  // checks for state and if null gets targetUser information from localstorage
  const [targetUserData, setTargetUserData] = useState(() => {
    return (
      state?.data ??
      state?.file ??
      JSON.parse(window.localStorage.getItem('targetUser'))
    );
  });

  // when targetUserData changes, saves targetUserData to localstorage and updates targetUserData
  useEffect(() => {
    window.localStorage.setItem('targetUser', JSON.stringify(targetUserData));
    setTargetUser(targetUserData);
  }, [setTargetUserData]);

  // useStates
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [profilePic, setProfilePic] = useState({
    filename: profilePlaceholder,
  });
  const [backgroundPic, setBackgroundPic] = useState({
    filename: filePlaceholder,
  });
  const [profileDescription, setprofileDescription] = useState(
    'No profile text yet!'
  );

  const fetchUserData = async () => {
    try {
      if (user) {
        const token = localStorage.getItem('token');
        const userInfo = await getUser(targetUserData.user_id, token);
        setTargetUserData(userInfo);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + targetUserData.user_id
        );
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        setProfilePic(profilePicture);
      }
    } catch (error) {
      if (error.message === 'Tag not found') {
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  const fetchBackgroundPicture = async () => {
    try {
      if (user) {
        const backgroundPictures = await getTag(
          appId + '_backgroundpicture_' + targetUserData.user_id
        );
        const backgroundPicture = backgroundPictures.pop();
        backgroundPicture.filename = mediaUrl + backgroundPicture.filename;
        setBackgroundPic(backgroundPicture);
      }
    } catch (error) {
      if (error.message === 'Tag not found') {
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  const fetchProfileDescription = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + targetUserData.user_id
        );
        const profileText = profilePictures.pop();
        setprofileDescription(profileText.description);
      }
    } catch (error) {
      if (error.message === 'Tag not found') {
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchAllRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      const mediaInfo = await getAllMediaById(targetUserData.user_id, token);
      let sum = 0;
      let count = 0;
      for (const data of mediaInfo) {
        await sleep(20);
        const ratings = await getRatingsById(data.file_id);
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
    fetchUserData();
    fetchProfilePicture();
    fetchBackgroundPicture();
    fetchProfileDescription();
    fetchAllRatings();
  }, []);

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
            width: '100%',
            mt: {xs: '-48px', sm: '-56px', md: '-56px'},
            px: 3,
            flexDirection: {xs: 'row', sm: 'row'},
          }}
        >
          <Box display="flex" flexDirection="column" textAlign="start">
            <Typography component="h1" variant="h1">
              {user
                ? targetUserData.full_name
                  ? targetUserData.full_name
                  : 'Has not set a full name'
                : 'Log in to view user details'}
            </Typography>
            <Typography component="p" variant="body1" sx={{mt: 0.5}}>
              {user && '@' + targetUserData.username}
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
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography
            component="p"
            variant="body1"
            sx={{maxWidth: 'sm', py: 4, px: {xs: 3, sm: 3}}}
          >
            {profileDescription}
          </Typography>
        </Box>
      </Container>
      <Container sx={{px: 0, pb: {xs: '3.5rem'}}}>
        <MediaTable targetUserFilesOnly={true} />
      </Container>
    </>
  );
};

export default UserProfiles;
