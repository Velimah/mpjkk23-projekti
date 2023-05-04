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
      <Container maxWidth="lg" sx={{p: {xs: '5rem 0', sm: '3rem 3rem'}}}>
        <Avatar
          src={backgroundPic.filename}
          alt="Logo"
          sx={{
            borderRadius: {xs: 0, sm: '2rem'},
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
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
              px: {xs: 3, md: 6},
              py: {xs: 1, md: 1},
              justifyContent: {xs: 'center', sm: 'center'},
              alignItems: {xs: 'flex-start', sm: 'flex-start'},
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
              value={Number(rating.toFixed(2))}
              readOnly
              sx={{mt: 1, color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
            />
            <Typography component="legend">
              {rating.toFixed(2)} ({ratingCount} ratings)
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              px: {xs: 3, sm: 2},
              pl: {xs: 0, sm: 2},
              py: {xs: 1, md: 1},
              width: {xs: '200px'},
            }}
          >
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mr: {xs: 0, sm: 0},
              }}
              onClick={() => navigate('/profile/update')}
            >
              Update
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mr: {
                  xs: 0,
                  sm: 0,
                  backgroundColor: 'red',
                  '&:hover': {
                    backgroundColor: 'FireBrick',
                  },
                },
              }}
              onClick={() => setDeleteAllInformationDialogOpen(true)}
            >
              Delete Data
            </Button>
            <Button
              variant="outlined"
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
        <MediaTable myFilesOnly={true} />
      </Container>
    </>
  );
};

export default Profile;
