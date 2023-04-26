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
  Grid,
} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useEffect, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {appId} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {uploadErrorMessages} from '../utils/errorMessages';
import {uploadValidators} from '../utils/validator';
import AlertDialog from '../components/AlertDialog';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedFilePlaceholder =
    'https://placehold.co/300x300?text=Choose-media';
  const [selectedFile, setSelectedFile] = useState(selectedFilePlaceholder);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const navigate = useNavigate();
  const initValues = {
    title: 'cat image',
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
        console.log(tagResult);
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
      setSelectedFile(reader.result);
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleTagDelete = (tagToDelete) => () => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
  };

  const handleDialogYes = () => {
    setDialogOpen(false);
    navigate(-1);
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
    <Container maxWidth="lg" sx={{p: {xs: '6rem 0', sm: '3rem 3rem'}}}>
      <Typography component="h1" variant="h1" textAlign="center" sx={{mb: 3}}>
        Add new photo
      </Typography>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <Paper
          sx={{
            p: {xs: 0, sm: '3rem'},
            borderRadius: '1.5rem',
            bgcolor: {xs: 'transparent', sm: '#FFFFFF'},
          }}
          elevation={0}
        >
          <Grid container columnSpacing={5} alignItems="start">
            <Grid item xs={12} md={7}>
              <img
                src={selectedFile}
                alt="Selected file's preview"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '1.25rem',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  filter: `brightness(${filterInputs.brightness}%)
                   contrast(${filterInputs.contrast}%)
                   saturate(${filterInputs.saturation}%)
                   sepia(${filterInputs.sepia}%)`,
                }}
              />
              <Box sx={{px: {xs: 4, sm: 0}}}>
                <input
                  // sx={
                  //   selectedFile !== selectedFilePlaceholder ? {my: 3} : {mt: 4}
                  // }
                  // fullWidth
                  onChange={handleFileChange}
                  type="file"
                  name="file"
                  accept="image/*"
                />
                {selectedFile !== selectedFilePlaceholder && (
                  <>
                    <Typography>Brightness:</Typography>
                    <Slider
                      name="brightness"
                      min={0}
                      max={200}
                      step={5}
                      valueLabelDisplay="auto"
                      onChange={handleFilterChange}
                      value={filterInputs.brightness}
                    />
                    <Typography>Contrast:</Typography>
                    <Slider
                      name="contrast"
                      min={0}
                      max={200}
                      step={5}
                      valueLabelDisplay="auto"
                      onChange={handleFilterChange}
                      value={filterInputs.contrast}
                    />
                    <Typography>Saturation:</Typography>
                    <Slider
                      name="saturation"
                      min={0}
                      max={200}
                      step={5}
                      valueLabelDisplay="auto"
                      onChange={handleFilterChange}
                      value={filterInputs.saturation}
                    />
                    <Typography>Sepia:</Typography>
                    <Slider
                      name="sepia"
                      min={0}
                      max={100}
                      step={5}
                      valueLabelDisplay="auto"
                      onChange={handleFilterChange}
                      value={filterInputs.sepia}
                    />
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{px: {xs: 4, sm: 0}}}>
                <TextValidator
                  sx={{mb: 4, mt: {xs: 4, md: 0}}}
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
                      sx={tags.length > 0 ? {mb: 2} : {mb: 4}}
                    />
                  )}
                />
                <Box sx={tags.length > 0 ? {mb: 4} : {mb: 0}}>
                  {tags.map((tag) => (
                    <Chip
                      variant="outlined"
                      color="primary"
                      key={tag}
                      label={tag}
                      onDelete={handleTagDelete(tag)}
                      sx={{mr: 1, mt: 1}}
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{mb: 2}}
                >
                  Upload
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setDialogOpen(true)}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </ValidatorForm>
      <AlertDialog
        title={'Are you sure you want to cancel creating a new post?'}
        content={'All your work will be lost.'}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        functionToDo={handleDialogYes}
      />
    </Container>
  );
};

export default Upload;
