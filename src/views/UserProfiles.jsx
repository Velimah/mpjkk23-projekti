import {Avatar, Box, Button, Rating, Typography} from '@mui/material';
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
import {useLocation, useNavigate} from 'react-router-dom';
import MediaTable from '../components/MediaTable';

const UserProfiles = () => {
  const {user, setTargetUser} = useContext(MediaContext);
  const {getTag} = useTag();
  const navigate = useNavigate();
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
        console.log('No background picture');
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
        console.log('No background picture');
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
        console.log('No profile description');
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
      <Box sx={{maxWidth: '1200px', margin: 'auto', pt: {xs: 8, sm: 0}}}>
        <Avatar
          src={backgroundPic.filename}
          alt="Logo"
          sx={{
            borderRadius: 0,
            borderBottomLeftRadius: {xs: 0, lg: '2rem'},
            borderBottomRightRadius: {xs: 0, lg: '2rem'},
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            maxWidth: '1200px',
            width: '100%',
            height: {xs: '150px', md: '300px'},
            maxHeight: '300px',
          }}
        />
        <Avatar
          src={profilePic.filename}
          alt="Logo"
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            borderStyle: 'solid',
            borderColor: '#FFFFFF',
            borderWidth: '3px',
            position: 'relative',
            height: {xs: '125px', sm: '150px', md: '200px'},
            width: {xs: '125px', sm: '150px', md: '200px'},
            top: {xs: '-100px', sm: '-125px', md: '-150px'},
            left: {xs: '25px', sm: '50px', md: '50px'},
          }}
        />
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            maxWidth: '1000px',
            width: '100%',
            margin: 'auto',
            mt: {xs: -12, sm: -17, md: -23},
            flexDirection: {xs: 'row', sm: 'row'},
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            textAlign="start"
            sx={{
              px: {xs: 2, md: 6},
              py: {xs: 1, md: 1},
              justifyContent: {xs: 'center', sm: 'center'},
              alignItems: {xs: 'flex-start', sm: 'flex-start'},
            }}
          >
            <Typography component="p" variant="h1" sx={{mt: 1}}>
              {targetUserData.full_name
                ? targetUserData.full_name
                : 'Has not set a full name'}
            </Typography>
            <Typography component="p" variant="body4" sx={{mt: 1}}>
              {'@' + targetUserData.username}
            </Typography>
            <Rating
              name="read-only"
              size="large"
              precision={0.5}
              value={Number(rating.toFixed(2))}
              readOnly
              sx={{mt: 1, color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
            />
            <Typography component="legend">
              {rating.toFixed(2)} ({ratingCount} ratings)
            </Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography
            component="p"
            variant="body3"
            alignSelf="center"
            sx={{
              maxWidth: '700px',
              p: {xs: 3, md: 3},
              fontSize: {xs: '1rem', md: '1.2rem'},
            }}
          >
            {profileDescription}
          </Typography>
        </Box>
      </Box>
      <MediaTable targetUserFilesOnly={true} />
      <Box display="flex" width="100%" justifyContent="center">
        <Button
          variant="contained"
          sx={{m: 5, width: '200px'}}
          onClick={() => navigate('/home')}
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default UserProfiles;
