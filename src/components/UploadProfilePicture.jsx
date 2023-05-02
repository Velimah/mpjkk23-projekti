import {Box, Button, Grid} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {MediaContext} from '../contexts/MediaContext';
import {updateProfilePictureValidators} from '../utils/validator';
import {updateProfilePictureErrorMessages} from '../utils/errorMessages';

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
    <Box sx={{maxWidth: 'md', margin: 'auto'}}>
      <Grid container direction={'column'} justifyContent="center" sx={{mt: 2}}>
        <Grid item xs={5} sx={{mt: 0}}>
          <img
            src={selectedImage}
            alt="preview"
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '100%',
            }}
          ></img>
        </Grid>
        <Grid item xs={5} sx={{}}>
          <ValidatorForm onSubmit={handleSubmit} noValidate>
            <TextValidator
              fullWidth
              sx={{mb: 1}}
              onChange={handleFileChange}
              type="file"
              name="file"
              accept="image/*, video/*, audio/*"
            />
            <TextValidator
              multiline
              maxRows={4}
              fullWidth
              margin="dense"
              name="description"
              label="Profile description"
              onChange={handleInputChange}
              value={inputs.description}
              validators={updateProfilePictureValidators.description}
              errorMessages={updateProfilePictureErrorMessages.description}
            />
            <Button variant="contained" fullWidth type="submit">
              Update Profile Picture and Description
            </Button>
          </ValidatorForm>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadProfilePicture;
