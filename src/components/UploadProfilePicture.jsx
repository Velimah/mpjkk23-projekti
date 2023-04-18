import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {appId, mediaUrl} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {MediaContext} from '../contexts/MediaContext';

const UploadProfilePicture = () => {
  const {user} = useContext(MediaContext);
  const {getTag, postTag} = useTag();
  const {postMedia} = useMedia();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState('https://placehold.co/300x300?text=Choose-Profile Picture');

  const fetchProfilePicture = async () => {
    try {
      if (user) {
        const profilePictures = await getTag(appId + '_profilepicture_' + user.user_id);
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        setSelectedImage(profilePicture.filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [user]);

  const doUpload = async () => {
    try {
      const data = new FormData();
      data.append('title', 'Profile Picture');
      data.append('file', file);
      const token = localStorage.getItem('token');
      const uploadResult = await postMedia(data, token);
      const tagResult = await postTag(
        {
          file_id: uploadResult.file_id,
          tag: appId + '_profilepicture_' + user.user_id,
        },
        token
      );
      navigate(0);
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

  const {handleSubmit} = useForm(
    doUpload,
  );

  return (
    <Box sx={{maxWidth: 'md', margin: 'auto'}}>
      <Grid container direction={'row'} justifyContent="center" sx={{mt: 2}}>
        <Grid item xs={5} sx={{mt: 0}}>
          <img
            src={selectedImage}
            alt="preview"
            style={{
              width: '100%',
              height: '100%',
            }}
          ></img>
        </Grid>
        <Grid item xs={5} sx={{pl: 2}}>
          <Grid
            container
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{mt: 0}}
          >
            <ValidatorForm onSubmit={handleSubmit} noValidate>
              <TextValidator
                sx={{mb: 1}}
                onChange={handleFileChange}
                type="file"
                name="file"
                accept="image/*, video/*, audio/*"
              />
              <Button variant="contained" fullWidth type="submit">
                Update Profile Picture
              </Button>
            </ValidatorForm>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadProfilePicture;