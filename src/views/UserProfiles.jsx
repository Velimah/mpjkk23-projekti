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

  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const [userData, setUserData] = useState(() => {
    return (
      state?.data ??
      state?.file ??
      JSON.parse(window.localStorage.getItem('targetUser'))
    );
  });

  useEffect(() => {
    window.localStorage.setItem('targetUser', JSON.stringify(userData));
    setTargetUser(userData);
  }, [setUserData]);

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
      const token = localStorage.getItem('token');
      const userInfo = await getUser(userData.user_id, token);
      setUserData(userInfo);
    } catch (error) {
      console.error(error.message);
    }
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
      console.error(error.message);
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
      console.error(error.message);
    }
  };

  const fetchProfileDescription = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + userData.user_id
        );
        const profileText = profilePictures.pop();
        setprofileDescription(profileText.description);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchAllRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      const mediaInfo = await getAllMediaById(userData.user_id, token);
      let sum = 0;
      let count = 0;
      for (const data of mediaInfo) {
        await sleep(200);
        const ratings = await getRatingsById(data.file_id);
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

  useEffect(() => {
    fetchUserData();
    fetchProfilePicture();
    fetchBackgroundPicture();
    fetchProfileDescription();
    fetchAllRatings();
    setTimeout(() => {
      countPosts();
    }, 1000);
  }, []);

  const countPosts = () => {
    const itemCount = document.querySelectorAll('.post').length;
    setPostCount(itemCount);
  };

  return (
    <>
      <Box sx={{maxWidth: '1200px', margin: 'auto', pt: {xs: 8, sm: 1, md: 1}}}>
        <Avatar
          src={backgroundPic.filename}
          alt="Logo"
          sx={{
            borderRadius: 0,
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            maxWidth: '1200px',
            width: '100%',
            height: {xs: '150px', sm: '300px'},
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
            height: {xs: '150px', sm: '175px', md: '200px'},
            width: {xs: '150px', sm: '175px', md: '200px'},
            top: {xs: '-75px', sm: '-100px', md: '-100px'},
            left: {xs: '0', sm: '50px', md: '50px'},
            margin: {xs: 'auto', sm: 'initial'},
          }}
        />
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            maxWidth: '1000px',
            width: '100%',
            margin: 'auto',
            mt: {xs: -8, sm: -23},
            flexDirection: {xs: 'row', sm: 'row'},
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            textAlign="center"
            sx={{
              px: {xs: 2, md: 6},
              py: {xs: 1, md: 1},
              justifyContent: {xs: 'center', sm: 'center'},
              alignItems: {xs: 'center', sm: 'center'},
            }}
          >
            <Typography component="p" variant="h1" sx={{mt: 1}}>
              {userData.full_name
                ? userData.full_name
                : 'Has not set a full name'}
            </Typography>
            <Typography component="p" variant="body4" sx={{mt: 1}}>
              {'@' + userData.username}
            </Typography>
            <Rating
              name="read-only"
              size="large"
              precision={0.5}
              value={rating.toFixed(2)}
              readOnly
              sx={{mt: 1}}
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
            sx={{maxWidth: '700px', px: {xs: 4, sm: 2}, py: {xs: 2}}}
          >
            {profileDescription}
          </Typography>
          <Typography
            component="p"
            variant="h2"
            sx={{maxWidth: '1000px', px: 3, py: 2}}
          >
            {postCount} {postCount === 1 ? 'post' : 'posts'}
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
