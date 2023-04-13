import {Card, CardMedia, Typography, Box, Grid, Button} from '@mui/material';
import {useLocation} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';

const Single = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const file = state.file;
  console.log(file);
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

  let componentType = 'img';
  switch (file.media_type) {
    case 'video':
      componentType = 'video';
      break;
    case 'audio':
      componentType = 'audio';
      break;
  }

  return (
    <>
      <Box sx={{maxWidth: 'lg', margin: 'auto', mt: 10}}>
        <Card>
          <Typography component="h1" variant="h2" sx={{p: 2}}>
            {file.title}
          </Typography>
          <CardMedia
            component={componentType}
            src={mediaUrl + file.filename}
            title={file.title}
            style={{
              filter: `brightness(${allData.filters.brightness}%)
                       contrast(${allData.filters.contrast}%)
                       saturate(${allData.filters.saturation}%)
                       sepia(${allData.filters.sepia}%)`,
            }}
          />
        </Card>
        <Grid container justifyContent="center">
          <Grid item xs={6} sx={{mb: 5}}>
            <Button
              variant="contained"
              fullWidth
              sx={{mt: 5}}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

// TODO in the next task: add propType for location

export default Single;
