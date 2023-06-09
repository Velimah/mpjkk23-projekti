import {
  Avatar,
  Box,
  Button,
  InputLabel,
  Typography,
  useMediaQuery,
} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useEffect, useState} from 'react';
import {
  useComment,
  useFavourite,
  useMedia,
  useRating,
  useTag,
} from '../hooks/ApiHooks';
import {appId, mediaUrl, profilePlaceholder} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {MediaContext} from '../contexts/MediaContext';
import {updateProfilePictureValidators} from '../utils/validator';
import {updateProfilePictureErrorMessages} from '../utils/errorMessages';
import {AddAPhoto} from '@mui/icons-material';
import {useTheme} from '@emotion/react';
import AlertDialog from '../components/AlertDialog';

const UploadProfilePicture = () => {
  const {
    user,
    refreshHeader,
    setRefreshHeader,
    setRefreshPage,
    refreshPage,
    setToastSnackbar,
    setToastSnackbarOpen,
  } = useContext(MediaContext);
  const {getTag, postTag} = useTag();
  const {postMedia} = useMedia();
  const {deleteRating, getAllRatings} = useRating();
  const {getAllMediaByCurrentUser, deleteMedia} = useMedia();
  const {deleteComment, getCommentsByUser} = useComment();
  const {deleteFavourite, getUsersFavouritesByToken} = useFavourite();

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(profilePlaceholder);
  const [description, setDescription] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [deleteAllInformationDialogOpen, setDeleteAllInformationDialogOpen] =
    useState(false);

  const initValues = {
    description: description,
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(
          appId + '_profilepicture_' + user.user_id
        );
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        setDescription(profilePicture.description);
        setSelectedImage(profilePicture.filename);
      }
    } catch (error) {
      if (error.message === 'Tag not found') {
        return;
      } else {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [user, refreshPage]);

  const doUpload = async () => {
    try {
      setMessageSent(true);
      const data = new FormData();

      data.append('file', file);
      data.append('title', 'Profile Picture');
      if (inputs.description === '') {
        data.append('description', description);
      } else {
        data.append('description', inputs.description);
      }
      const token = localStorage.getItem('token');
      const uploadResult = await postMedia(data, token);
      await postTag(
        {
          file_id: uploadResult.file_id,
          tag: appId + '_profilepicture_' + user.user_id,
        },
        token
      );
      setMessageSent(false);
      setRefreshHeader(!refreshHeader);
      setToastSnackbar({
        severity: 'success',
        message: 'Profile picture updated successfully',
      });
      setToastSnackbarOpen(true);
    } catch (error) {
      setMessageSent(false);
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
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
        await sleep(5);
        const deleteFileInfo = await deleteMedia(file.file_id, token);
        console.log('deleteMedia', deleteFileInfo);
      }
      setRefreshPage(!refreshPage);
      setToastSnackbar({
        severity: 'success',
        message: 'All information deleted',
      });
      setToastSnackbarOpen(true);
    } catch (error) {
      console.log(error.message);
      setToastSnackbar({
        severity: 'error',
        message: 'Deleting information failed',
      });
      setToastSnackbarOpen(true);
    }
  };

  const handleFileChange = (event) => {
    event.persist();
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImage(reader.result);
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doUpload,
    initValues
  );

  useEffect(() => {
    ValidatorForm.addValidationRule('isEmptyOrMin2', (value) => {
      return value === '' || value.length >= 2;
    });
  }, [inputs]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      sx={{
        flexWrap: 'nowrap',
        width: '100%',
        pl: {xs: 3, sm: 0},
        pr: {xs: 3, sm: 1, md: 3},
        mb: {xs: '-80px', sm: 0},
      }}
    >
      <Avatar
        src={selectedImage}
        alt="Logo"
        sx={{
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          borderStyle: 'solid',
          borderColor: '#FFFFFF',
          borderWidth: '3px',
          position: 'relative',
          height: {xs: '125px', sm: '125', md: '200px'},
          width: {xs: '125px', sm: '125', md: '200px'},
          top: {xs: '-100px', sm: '-125px', md: '-150px'},
          left: {xs: '0px', sm: '50px', md: '50px'},
        }}
      />
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <Box display="flex" flexDirection="column" justifyContent="flex-end">
          <InputLabel
            sx={{
              position: 'relative',
              top: {xs: '-140px', sm: '-165px', md: '-190px'},
              left: {xs: '65px', sm: '115px', md: '170px'},
              py: 1,
              pb: '0.3rem',
              px: 2,
              height: '100%',
              backgroundColor: '#ACCC7F',
              borderRadius: '2rem',
              cursor: 'pointer',
              width: 'fit-content',
              '&:hover': {
                backgroundColor: '#8FB361',
                color: '#000000',
                transition: 'background-color 0.2s, color 0.2s',
              },
              boxShadow:
                '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
            }}
            htmlFor="profilepic-upload"
          >
            <AddAPhoto />
          </InputLabel>
          <TextValidator
            sx={{display: 'none'}}
            id="profilepic-upload"
            onChange={handleFileChange}
            type="file"
            name="file"
            accept="image/*, video/*, audio/*"
          />
          <Box
            sx={{
              position: 'relative',
              top: {xs: '-120px', sm: '-150px', md: '-180px'},
            }}
          >
            <Typography
              component="p"
              variant="body1"
              sx={{textAlign: 'center', fontSize: '0.9rem'}}
            >
              Avatar required, description updates if filled
            </Typography>
            <TextValidator
              fullWidth
              multiline
              rows={smallScreen ? 2 : 4}
              margin="dense"
              name="description"
              label="Profile description"
              onChange={handleInputChange}
              value={inputs.description}
              validators={updateProfilePictureValidators.description}
              errorMessages={updateProfilePictureErrorMessages.description}
            />
            <Button
              fullWidth
              sx={{
                backgroundColor: messageSent ? '#ACCC7F' : '',
                color: messageSent ? '#000000' : '',
                '&:hover': {
                  backgroundColor: messageSent ? '#8FB361' : '',
                  color: messageSent ? '#000000' : '',
                },
                mt: 1,
              }}
              variant="contained"
              type="submit"
            >
              Update avatar and description
            </Button>
          </Box>
        </Box>
      </ValidatorForm>
      <Box
        sx={{
          border: '1px solid grey',
          borderRadius: '1.25rem',
          backgroundColor: '#F4DCE1',
          position: 'relative',
          top: {xs: '-80px', sm: '-110px', md: '-140px'},
          height: '100%',
          py: 2,
          px: 2,
        }}
      >
        <Typography
          component="p"
          variant="body1"
          sx={{mb: 2, textAlign: 'center'}}
        >
          Danger Zone
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="error"
          size="small"
          sx={{mb: 0}}
          onClick={() => setDeleteAllInformationDialogOpen(true)}
        >
          Delete All Information
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
  );
};

export default UploadProfilePicture;
