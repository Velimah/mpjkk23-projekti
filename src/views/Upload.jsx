import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Slider,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {appId} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {uploadErrorMessages} from '../utils/errorMessages';
import {uploadValidators} from '../utils/validator';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
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

      let tagsTmp = [{file_id: uploadResult.file_id, tag: appId}];

      tagsTmp = tagsTmp.concat(
        tags.map((tag) => {
          return {file_id: uploadResult.file_id, tag: appId + '_' + tag};
        })
      );

      for (const tag of tagsTmp) {
        const tagResult = await postTag(tag, token);
      }

      navigate('/home');
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

  const handleTagDelete = (tagToDelete) => () => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doUpload,
    initValues
  );

  const {inputs: filterInputs, handleInputChange: handleFilterChange} = useForm(
    null,
    filterInitValues
  );

  useEffect(() => {
    ValidatorForm.addValidationRule('isEmptyOrMin2', (value) => {
      return value === '' || value.length >= 2;
    });
  }, [inputs]);

  return (
    <Container maxWidth="sm" sx={{px: {xs: '32px', sm: '16px'}}}>
      <Paper sx={{px: '32px'}}>
        <Typography component="h1" variant="h2" textAlign="center" sx={{my: 6}}>
          Create new post
        </Typography>
        <img
          src={selectedImage}
          alt="Selected file's preview"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '25px',
            filter: `brightness(${filterInputs.brightness}%)
                   contrast(${filterInputs.contrast}%)
                   saturate(${filterInputs.saturation}%)
                   sepia(${filterInputs.sepia}%)`,
          }}
        ></img>
        <ValidatorForm onSubmit={handleSubmit} noValidate>
          <TextValidator
            sx={{mb: 3}}
            fullWidth
            onChange={handleFileChange}
            type="file"
            name="file"
            accept="image/*, video/*"
          />{' '}
          {selectedImage && (
            <>
              <Typography>Brightness</Typography>
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
              <Typography>Contrast</Typography>
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
              <Typography>Saturation</Typography>
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
              <Typography>Sepia</Typography>
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
            </>
          )}
          <TextValidator
            sx={{mb: 3}}
            fullWidth
            onChange={handleInputChange}
            type="text"
            name="title"
            placeholder="Title"
            label="Title"
            value={inputs.title}
            validators={uploadValidators.title}
            errorMessages={uploadErrorMessages.title}
          />
          <TextValidator
            sx={{mb: 3}}
            fullWidth
            multiline
            rows={4}
            onChange={handleInputChange}
            name="description"
            value={inputs.description}
            variant="outlined"
            placeholder="Description"
            label="Description"
            validators={uploadValidators.description}
            errorMessages={uploadErrorMessages.description}
          />
          <Autocomplete
            multiple
            options={[]}
            defaultValue={[]}
            freeSolo
            value={tags}
            onChange={(e, value) => setTags(value)}
            disabled={tags.length >= 5 && true}
            renderTags={() => null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Keywords"
                placeholder="Add a keyword by pressing enter after writing"
                helperText="Add up to 5 keywords, for example your cat's breed."
                disabled={tags.length >= 5 && true}
              />
            )}
          />
          <Box
            mt={3}
            sx={{
              '& > :not(:last-child)': {marginRight: 1},
              '& > *': {marginBottom: 1},
            }}
          >
            {tags.map((tag) => (
              <Chip
                variant="outlined"
                color="primary"
                key={tag}
                label={tag}
                onDelete={handleTagDelete(tag)}
              />
            ))}
          </Box>
          <Button variant="contained" fullWidth type="submit">
            Upload
          </Button>
        </ValidatorForm>
        <Button
          variant="contained"
          fullWidth
          sx={{mt: 5}}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Paper>
    </Container>
  );
};

export default Upload;
