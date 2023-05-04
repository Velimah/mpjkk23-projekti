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
import {
  useComment,
  useFavourite,
  useMedia,
  useRating,
  useTag,
} from '../hooks/ApiHooks';
import {
  appId,
  filePlaceholder,
  mediaUrl,
  profilePlaceholder,
} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import MediaTable from '../components/MediaTable';
import AlertDialog from '../components/AlertDialog';
import {StarOutlineRounded, StarRounded} from '@mui/icons-material';

const Profile = () => {
  const {user, setUser, refreshPage, setRefreshPage} = useContext(MediaContext);
  const {getTag} = useTag();
  const {getRatingsById, deleteRating, getAllRatings} = useRating();
  const {getAllMediaByCurrentUser, deleteMedia} = useMedia();
  const {deleteComment, getCommentsByUser} = useComment();
  const {deleteFavourite, getUsersFavouritesByToken} = useFavourite();
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
  const [deleteAllInformationDialogOpen, setDeleteAllInformationDialogOpen] =
    useState(false);

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

  const deleteAllInformation = async () => {
    setDeleteAllInformationDialogOpen(false);
    try {
      const token = localStorage.getItem('token');

      const likesInfo = await getUsersFavouritesByToken(token);
      for (const file of likesInfo) {
        await sleep(5);
        const deleteLikesInfo = await deleteFavourite(file.file_id, token);
        console.log('deleteLikesInfo', deleteLikesInfo);
      }
      const commentsInfo = await getCommentsByUser(token);
      for (const file of commentsInfo) {
        await sleep(5);
        const deleteCommentsInfo = await deleteComment(file.comment_id, token);
        console.log('deleteCommentsInfo', deleteCommentsInfo);
      }

      const ratingsInfo = await getAllRatings(token);
      for (const file of ratingsInfo) {
        await sleep(5);
        const deleteRatingsInfo = await deleteRating(file.file_id, token);
        console.log('deleteRatingsInfo', deleteRatingsInfo);
      }

      const mediaInfo = await getAllMediaByCurrentUser(token);
      for (const file of mediaInfo) {
        await sleep(20);
        const deleteFileInfo = await deleteMedia(file.file_id, token);
        console.log('deleteMedia', deleteFileInfo);
      }
      setRefreshPage(!refreshPage);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
    fetchBackgroundPicture();
    fetchProfileDescription();
    fetchAllRatings();
  }, [userData]);

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
            justifyContent="center"
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
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{
                mt: 2,
                mr: {
                  xs: 0,
                  sm: 0,
                },
              }}
              onClick={() => setDeleteAllInformationDialogOpen(true)}
            >
              Delete Data
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{mt: 2, mr: {xs: 0, sm: 0}}}
              onClick={() => navigate('/logout')}
            >
              Logout
            </Button>
            <AlertDialog
              title={'Are you sure you want to delete all your information?'}
              content={
                'This will delete all your posts, added likes and ratings and comments, and they will be lost permanently.'
              }
              functionToDo={deleteAllInformation}
              dialogOpen={deleteAllInformationDialogOpen}
              setDialogOpen={setDeleteAllInformationDialogOpen}
            />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography
            component="p"
            variant="body1"
            sx={{
              px: 3,
              pt: 2,
              pb: 6,
            }}
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
