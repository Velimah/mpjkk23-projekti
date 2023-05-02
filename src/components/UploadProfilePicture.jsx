import {Avatar, Box, Button, Grid, InputLabel} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {MediaContext} from '../contexts/MediaContext';
import {updateProfilePictureValidators} from '../utils/validator';
import {updateProfilePictureErrorMessages} from '../utils/errorMessages';
import {AddAPhoto} from '@mui/icons-material';

const UploadProfilePicture = () => {
  const {user} = useContext(MediaContext);
  const {getTag, postTag} = useTag();
  const {postMedia} = useMedia();

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    'https://placehold.co/300x300?text=Choose-Profile Picture'
  );
  const [description, setDescription] = useState('');

  const initValues = {
    description: description,
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
  }, [user]);

  const doUpload = async () => {
    try {
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
      const tagResult = await postTag(
        {
          file_id: uploadResult.file_id,
          tag: appId + '_profilepicture_' + user.user_id,
        },
        token
      );
      console.log(tagResult);
      alert('Profile picture updated!');
    } catch (error) {
      alert(error.message);
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
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          sx={{}}
        >
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
              borderRadius: '0.5rem',
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
            <TextValidator
              sx={{}}
              fullWidth
              multiline
              rows={6}
              margin="dense"
              name="description"
              label="Profile description"
              onChange={handleInputChange}
              value={inputs.description}
              validators={updateProfilePictureValidators.description}
              errorMessages={updateProfilePictureErrorMessages.description}
            />
            <Button sx={{mt: 1}} variant="contained" fullWidth type="submit">
              Update Avatar and Description
            </Button>
          </Box>
        </Box>
      </ValidatorForm>
    </Box>
  );
};

export default UploadProfilePicture;
