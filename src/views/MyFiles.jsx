import {Box, Typography} from '@mui/material';
import MediaTable from '../components/MediaTable';

const MyFiles = (props) => {
  return (
    <>
      <Box sx={{maxWidth: 'lg', margin: 'auto'}}>
        <Typography
          component="h1"
          variant="h2"
          textAlign="center"
          sx={{mt: 10}}
        >
          My Files
        </Typography>
        <MediaTable myFilesOnly={true} />
      </Box>
    </>
  );
};

export default MyFiles;
