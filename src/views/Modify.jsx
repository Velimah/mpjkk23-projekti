import {
  Box,
  Button,
  Container,
  Grid,
  Slider,
  Typography,
  useMediaQuery,
  Paper,
  Chip,
} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useLocation, useNavigate} from 'react-router-dom';
import {mediaUrl, appId} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {uploadErrorMessages} from '../utils/errorMessages';
import {uploadValidators} from '../utils/validator';
import {useContext, useEffect, useState} from 'react';
import AlertDialog from '../components/AlertDialog';
import {MediaContext} from '../contexts/MediaContext';

const Modify = () => {
  const navigate = useNavigate();

  const {putMedia} = useMedia();
  const {getTagsByFileId} = useTag();
  const {setToastSnackbar, setToastSnackbarOpen} = useContext(MediaContext);
  const {state} = useLocation();

  if (state === null) navigate('/home');

  const file = state.file;

  const [tags, setTags] = useState([]);
  const [cancelModifyDialogOpen, setCancelModifyDialogOpen] = useState(false);

  // FOR DELETING TAGS AND ADDING NEW (if the api would't need admin permission)
  // const [originalTags, setOriginalTags] = useState([]);
  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );

  let selectedFile = mediaUrl + file.filename;

  if (file.media_type === 'video') selectedFile = mediaUrl + file.screenshot;

  if (file.media_type === 'audio') {
    selectedFile = 'https://placehold.co/300x300?text=No image preview';
  }

  let allData = {
    desc: file.description,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
    },
  };

  const fetchTags = async () => {
    try {
      const tagInfo = await getTagsByFileId(file.file_id);
      const filteredTags = tagInfo.filter((tag) => tag.tag !== appId);
      // setOriginalTags(filteredTags);
      setTags(
        filteredTags.map((tag) => tag.tag.replace(appId + '_', '') + ' ')
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // FOR DELETING TAGS AND ADDING NEW (if the api would't need admin permission)
  // useEffect(() => {
  //   console.log(tags);
  // }, [tags]);
  // const doTagDelete = (tagToDelete) => () => {
  //   const newTags = tags.filter((tag) => tag !== tagToDelete);
  //   setTags(newTags);
  // };

  try {
    allData = JSON.parse(file.description);
  } catch (error) {
    console.log(allData);
  }

  const initValues = {
    title: file.title,
    description: allData.desc,
  };

  const filterInitValues = allData.filters;

  const doModify = async () => {
    try {
      const allData = {
        desc: inputs.description,
        filters: filterInputs,
      };

      const data = {
        title: inputs.title,
        description: JSON.stringify(allData),
      };

      const token = localStorage.getItem('token');
      const modifyResult = await putMedia(file.file_id, data, token);

      // FOR DELETING TAGS AND ADDING NEW (if the api would't need admin permission)
      // const oldTags = originalTags.map(
      //   (tag) => tag.tag.replace(appId + '_', '') + ' '
      // );
      // // Check if tags have changed
      // if (oldTags.sort() != newTags.sort()) {
      //   console.log('Not same tags');
      //   // Delete old tags
      //   const tagIdsToDeleteTmp = originalTags.map((tag) => tag.tag_id);
      //   for (const tagId of tagIdsToDeleteTmp) {
      //     const tagResult = await deleteTag(tagId, token);
      //     console.log(tagResult);
      //   }
      //   // Add new tags
      //   let tagsTmp = [{file_id: file.file_id, tag: appId}];
      //   tagsTmp = tagsTmp.concat(
      //     newTags.maps((tag) => {
      //       return {file_id: file.file_id, tag: appId + '_' + tag};
      //     })
      //   );
      //   for (const tag of tagsTmp) {
      //     const tagResult = await postTag(tag, token);
      //     console.log(tagResult);
      //   }
      // }

      setToastSnackbar({severity: 'success', message: modifyResult.message});
      setToastSnackbarOpen(true);
      navigate('/home');
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later.',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const handleCancelModify = () => {
    setCancelModifyDialogOpen(false);
    navigate('/home');
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doModify,
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
        Modify post
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
              {file.media_type === 'video' ? (
                <video
                  controls
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: extraSmallScreen ? 0 : '1.25rem',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                  }}
                >
                  <source src={mediaUrl + file.filename}></source>
                </video>
              ) : (
                <img
                  src={selectedFile}
                  alt="File's preview"
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

              {file.media_type === 'image' && (
                <Box sx={{px: {xs: 4, sm: 0}, mt: 3}}>
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
                </Box>
              )}
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
                {/* FOR DELETING TAGS AND ADDING NEW (if the api would't need admin permission)
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
                /> */}
                {tags.length > 0 && (
                  <Box sx={{mb: 4}}>
                    <Typography component="p" variant="subtitle2">
                      Added keywords:
                    </Typography>
                    {tags.map((tag) => (
                      <Chip
                        variant="outlined"
                        color="primary"
                        key={tag}
                        label={tag}
                        sx={{mr: 1, mt: 1}}
                      />
                    ))}
                  </Box>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{mb: 2}}
                  size="large"
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setCancelModifyDialogOpen(true)}
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
        title={'Are you sure you want to cancel modifying this post?'}
        content={'All your work will be lost.'}
        dialogOpen={cancelModifyDialogOpen}
        setDialogOpen={setCancelModifyDialogOpen}
        functionToDo={handleCancelModify}
      />
    </Container>
  );
};

export default Modify;
