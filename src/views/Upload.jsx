import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';
import {useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {appId} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {uploadErrorMessages} from '../utils/errorMessages';
import {uploadValidators} from '../utils/validator';

const Upload = (props) => {
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    'https://placehold.co/300x300?text=Choose-media'
  );
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const navigate = useNavigate();

  const initValues = {
    title: '',
    description: '',
  };

  const filterInitValues = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
  };

  const doUpload = async () => {
    try {
      const data = new FormData();
      data.append('title', inputs.title);
      const allData = {
        desc: inputs.description,
        filters: filterInputs,
      };
      data.append('description', JSON.stringify(allData));
      data.append('file', file);
      const token = localStorage.getItem('token');
      const uploadResult = await postMedia(data, token);
      const tagResult = await postTag(
        {
          file_id: uploadResult.file_id,
          tag: appId,
        },
        token
      );
      console.log(uploadResult);
      console.log(tagResult);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFileChange = (event) => {
    event.persist();
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImage(reader.result);
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doUpload,
    initValues
  );

  const {inputs: filterInputs, handleInputChange: handleFilterChange} = useForm(
    null,
    filterInitValues
  );

  return (
    <Box sx={{maxWidth: 'md', margin: 'auto', mt: 10}}>
      <Grid container direction={'row'} justifyContent="center" sx={{mt: 2}}>
        <Grid item xs={5} sx={{mt: 0}}>
          <img
            src={selectedImage}
            alt="preview"
            style={{
              width: '100%',
              height: '100%',
              filter: `brightness(${filterInputs.brightness}%)
                   contrast(${filterInputs.contrast}%)
                   saturate(${filterInputs.saturation}%)
                   sepia(${filterInputs.sepia}%)`,
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
                fullWidth
                onChange={handleInputChange}
                type="text"
                name="title"
                placeholder="Title"
                value={inputs.title}
                validators={uploadValidators.title}
                errorMessages={uploadErrorMessages.title}
              />
              <TextValidator
                sx={{mb: 1}}
                fullWidth
                multiline
                rows={4}
                onChange={handleInputChange}
                name="description"
                value={inputs.description}
                variant="filled"
                placeholder="Description (optional)"
                validators={uploadValidators.description}
                errorMessages={uploadErrorMessages.description}
              />
              <TextValidator
                sx={{mb: 1}}
                onChange={handleFileChange}
                type="file"
                name="file"
                accept="image/*, video/*, audio/*"
                validators={uploadValidators.file}
                errorMessages={uploadErrorMessages.file}
              />
              <Button variant="contained" fullWidth type="submit">
                Upload
              </Button>
            </ValidatorForm>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        direction={'row'}
        justifyContent="start"
        sx={{mt: 2, ml: 9}}
      >
        <Grid item xs={5} sx={{mt: 2}}>
          <Typography id="input-slider">Brightness</Typography>
          <Slider
            name="brightness"
            min={0}
            max={200}
            step={5}
            marks={true}
            valueLabelDisplay="auto"
            onChange={handleFilterChange}
            value={filterInputs.brightness}
          />
          <Typography id="input-slider">Contrast</Typography>
          <Slider
            name="contrast"
            min={0}
            max={200}
            step={5}
            marks={true}
            valueLabelDisplay="auto"
            onChange={handleFilterChange}
            value={filterInputs.contrast}
          />
          <Typography id="input-slider">Saturation</Typography>
          <Slider
            name="saturation"
            min={0}
            max={200}
            step={5}
            marks={true}
            valueLabelDisplay="auto"
            onChange={handleFilterChange}
            value={filterInputs.saturation}
          />
          <Typography id="input-slider">Sepia</Typography>
          <Slider
            name="sepia"
            min={0}
            max={100}
            step={5}
            marks={true}
            valueLabelDisplay="auto"
            onChange={handleFilterChange}
            value={filterInputs.sepia}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{my: 5}}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

Upload.propTypes = {};

export default Upload;
