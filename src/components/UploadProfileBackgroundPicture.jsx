import {Avatar, Box, Button, Grid, InputLabel} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useState, useEffect} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {MediaContext} from '../contexts/MediaContext';
import {AddAPhoto} from '@mui/icons-material';

const UploadProfileBackgroundPicture = () => {
  const {user} = useContext(MediaContext);
  const {postMedia} = useMedia();
  const {postTag, getTag} = useTag();

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    'https://placehold.co/300x300?text=Choose-Background Picture'
  );

  const fetchBackgroundPicture = async () => {
    try {
      if (user) {
        const backgroundPictures = await getTag(
          appId + '_backgroundpicture_' + user.user_id
        );
        const backGroundPicture = backgroundPictures.pop();
        backGroundPicture.filename = mediaUrl + backGroundPicture.filename;
        setSelectedImage(backGroundPicture.filename);
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
    fetchBackgroundPicture();
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
          tag: appId + '_backgroundpicture_' + user.user_id,
        },
        token
      );
      console.log(uploadResult);
      console.log(tagResult);
      alert('Background picture updated!');
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

  const {handleSubmit} = useForm(doUpload);

  return (
    <Grid
      container
      direction={'column'}
      justifyContent="center"
      sx={{flexWrap: 'nowrap'}}
    >
      <Grid item sx={{mt: 0}}>
        <Avatar
          src={selectedImage}
          alt="Logo"
          sx={{
            borderRadius: {xs: 0, sm: '2rem'},
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            maxWidth: '1200px',
            width: '100%',
            height: {xs: '150px', md: '300px'},
            maxHeight: '300px',
          }}
        />
      </Grid>
      <Grid item>
        <ValidatorForm
          onSubmit={handleSubmit}
          noValidate
          sx={{display: 'flex'}}
        >
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{position: 'relative', top: '-55px', left: '-15px'}}
          >
            <InputLabel
              sx={{
                py: 1,
                pb: '0.3rem',
                px: 2,
                height: '100%',
                backgroundColor: '#ACCC7F',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#8FB361',
                  color: '#000000',
                  transition: 'background-color 0.2s, color 0.2s',
                },
                boxShadow:
                  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
              }}
              htmlFor="bg-upload"
            >
              <AddAPhoto />
            </InputLabel>
            <TextValidator
              sx={{display: 'none'}}
              id="bg-upload"
              style={{maxWidth: '400px', width: '100%'}}
              onChange={handleFileChange}
              type="file"
              name="file"
              accept="image/*, video/*, audio/*"
            />
            <label htmlFor="contained-button-file">
              <Button
                sx={{ml: 1}}
                variant="contained"
                color="primary"
                component="span"
                type="submit"
              >
                Upload
              </Button>
            </label>
          </Box>
        </ValidatorForm>
      </Grid>
    </Grid>
  );
};

export default UploadProfileBackgroundPicture;
