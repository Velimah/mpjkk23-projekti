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
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useContext, useEffect, useRef, useState} from 'react';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import {appId, filePlaceholder} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {uploadErrorMessages} from '../utils/errorMessages';
import {uploadValidators} from '../utils/validator';
import AlertDialog from '../components/AlertDialog';
import {MediaContext} from '../contexts/MediaContext';

const Upload = () => {
  const {setToastSnackbar, setToastSnackbarOpen} = useContext(MediaContext);
  const {postMedia} = useMedia();
  const {postTag} = useTag();

  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [fileError, setFileError] = useState({isError: false, message: ''});
  const [cancelUploadDialogOpen, setCancelUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(filePlaceholder);
  const [upload, setUpload] = useState(false);

  const navigate = useNavigate();
  const videoRef = useRef();

  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );

  const initValues = {
    title: 'Cat post',
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
      // Validate file
      validateFile(file);
      // Check is file valid
      if (fileError.isError) {
        return;
      }
      // Set upload process started, changes buttons in form
      setUpload(true);
      // Create form data and append title, desc, filters and file to it
      const data = new FormData();
      data.append('title', inputs.title);
      const allData = {
        desc: inputs.description,
        filters: filterInputs,
      };
      data.append('description', JSON.stringify(allData));
      data.append('file', file);
      // Get token and start postMedia
      const token = localStorage.getItem('token');
      const uploadResult = await postMedia(data, token);
      // Create temp array for tags
      let tagsTmp = [{file_id: uploadResult.file_id, tag: appId}];
      // Add tags that user inputted
      tagsTmp = tagsTmp.concat(
        tags.map((tag) => {
          return {
            file_id: uploadResult.file_id,
            tag: appId + '_' + tag.toLowerCase(),
          };
        })
      );
      // Loop postTags
      for (const tag of tagsTmp) {
        const tagResult = await postTag(tag, token);
        console.log(tagResult);
      }

      setToastSnackbar({severity: 'success', message: uploadResult.message});
      setToastSnackbarOpen(true);

      // Navigate back to home
      navigate('/home');
    } catch (error) {
      setUpload(false);
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later.',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const handleFileChange = (event) => {
    event.persist();
    // Remove errors from fileError
    setFileError({isError: false, message: ''});
    setFile(event.target.files[0]);
    // Check if files' type is video and create blob from it to add to selectedFile
    if (event.target.files[0].type.includes('video')) {
      const file = event.target.files[0];
      const blobURL = URL.createObjectURL(file);
      setSelectedFile(blobURL);
    } else if (event.target.files[0].type.includes('image')) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedFile(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
    validateFile(event.target.files[0]);
  };

  const validateFile = (file) => {
    // Check if there is a file
    if (file === null) {
      setFileError({isError: true, message: 'File is required'});
      return;
    }

    // Check that file is video or image
    if (!file.type.includes('image') & !file.type.includes('video')) {
      setFileError({
        isError: true,
        message: 'File needs to be video or image file',
      });
      return;
    }

    // Check file size
    const maxFileSize = file.type.includes('image') ? 5000000 : 45000000;
    if (file.size > maxFileSize) {
      setFileError({
        isError: true,
        message: 'Maximum filesize is 45 MB for video and 5 MB for image files',
      });
      return;
    }
  };

  useEffect(() => {
    videoRef.current?.load();
  }, [selectedFile]);

  const doTagDelete = (tagToDelete) => () => {
    const newTags = tags.filter(
      (tag) => tag.toLowerCase() !== tagToDelete.toLowerCase()
    );
    setTags(newTags);
  };

  const handleCancelModify = () => {
    setCancelUploadDialogOpen(false);
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
        Add new post
      </Typography>
      <ValidatorForm onSubmit={handleSubmit} noValidate>
        <Paper
          sx={{
            p: {xs: 0, sm: '3rem'},
            borderRadius: '1.5rem',
            bgcolor: {xs: 'transparent', sm: '#FFFFFF'},
          }}
          elevation={extraSmallScreen ? 0 : 6}
        >
          <Grid container columnSpacing={5} alignItems="start">
            <Grid item xs={12} md={7}>
              {file && file.type.includes('video') ? (
                <video
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: extraSmallScreen ? 0 : '1.25rem',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                  }}
                  ref={videoRef}
                >
                  <source src={selectedFile} type={file.type}></source>
                </video>
              ) : (
                <img
                  src={selectedFile}
                  alt="Selected file's preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: extraSmallScreen ? 0 : '1.25rem',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    filter: `brightness(${filterInputs.brightness}%)
                   contrast(${filterInputs.contrast}%)
                   saturate(${filterInputs.saturation}%)
                   sepia(${filterInputs.sepia}%)`,
                  }}
                />
              )}

              <Box sx={{px: {xs: 4, sm: 0}}}>
                <TextField
                  sx={selectedFile !== filePlaceholder ? {my: 3} : {mt: 3}}
                  fullWidth
                  onChange={handleFileChange}
                  type="file"
                  name="file"
                  accept="image/*,video/*"
                  error={fileError.isError}
                  helperText={
                    fileError.isError
                      ? fileError.message
                      : 'Maximum filesize is 45 MB for video and 5 MB for image files'
                  }
                />
                {selectedFile !== filePlaceholder &&
                  file.type.includes('image') && (
                    <>
                      <Typography component="p" variant="subtitle2">
                        Brightness:
                      </Typography>
                      <Slider
                        name="brightness"
                        min={0}
                        max={200}
                        step={5}
                        valueLabelDisplay="auto"
                        onChange={handleFilterChange}
                        value={filterInputs.brightness}
                      />
                      <Typography component="p" variant="subtitle2">
                        Contrast:
                      </Typography>
                      <Slider
                        name="contrast"
                        min={0}
                        max={200}
                        step={5}
                        valueLabelDisplay="auto"
                        onChange={handleFilterChange}
                        value={filterInputs.contrast}
                      />
                      <Typography component="p" variant="subtitle2">
                        Saturation:
                      </Typography>
                      <Slider
                        name="saturation"
                        min={0}
                        max={200}
                        step={5}
                        valueLabelDisplay="auto"
                        onChange={handleFilterChange}
                        value={filterInputs.saturation}
                      />
                      <Typography component="p" variant="subtitle2">
                        Sepia:
                      </Typography>
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
                      helperText="Add up to 5 keywords, for example your cat's breed"
                      disabled={tags.length >= 5 && true}
                      sx={tags.length > 0 ? {mb: 2} : {mb: 4}}
                    />
                  )}
                />
                <Box sx={tags.length > 0 ? {mb: 4} : {mb: 0}}>
                  {tags.map((tag, index) => (
                    <Chip
                      variant="outlined"
                      color="primary"
                      key={index}
                      label={tag.toLowerCase()}
                      onDelete={doTagDelete(tag)}
                      sx={{mr: 1, mt: 1}}
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{mb: 2}}
                  disabled={upload}
                  size="large"
                >
                  {upload ? 'Uploading...' : 'Upload'}
                  {upload && (
                    <CircularProgress color="black" sx={{ml: 2}} size={24} />
                  )}
                </Button>
                {upload && (
                  <Typography component="p" variant="subtitle2" sx={{mb: 2}}>
                    This might take a while depending on your file size.
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setCancelUploadDialogOpen(true)}
                  disabled={upload}
                  size="large"
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </ValidatorForm>
      <AlertDialog
        title={'Are you sure you want to cancel adding a new post?'}
        content={'All your work will be lost permanently.'}
        dialogOpen={cancelUploadDialogOpen}
        setDialogOpen={setCancelUploadDialogOpen}
        functionToDo={handleCancelModify}
      />
    </Container>
  );
};

export default Upload;
