import {Box, Button, Grid, Typography} from '@mui/material';
import MediaTable from '../components/MediaTable';
import {useNavigate} from 'react-router-dom';

const MyFiles = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{maxWidth: 'lg', margin: 'auto'}}>
        <Typography component="h1" variant="h2" textAlign="center" sx={{my: 6}}>
          My Files
        </Typography>
        <MediaTable myFilesOnly={true} />
      </Box>
      <Grid container justifyContent="center">
        <Grid item xs={4}>
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
    </>
  );
};

export default MyFiles;
