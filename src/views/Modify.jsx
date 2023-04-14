import {Box, Button, Grid, Slider, Typography} from '@mui/material';
import useForm from '../hooks/FormHooks';
import {useMedia} from '../hooks/ApiHooks';
import {useLocation, useNavigate} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {uploadErrorMessages} from '../utils/errorMessages';
import {uploadValidators} from '../utils/validator';

const Modify = () => {
  const {putMedia} = useMedia();
  const navigate = useNavigate();
  const {state} = useLocation();
  const file = state.file;

  const selectedImage = mediaUrl + file.filename;

  let allData = {
    desc: file.description,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
    },
  };
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
        description: allData,
      };
      const token = localStorage.getItem('token');
      const modifyResult = await putMedia(file.file_id, data, token);
      console.log(modifyResult);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const {inputs, handleSubmit, handleInputChange} = useForm(
    doModify,
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

export default Modify;
