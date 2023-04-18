import {Box, Button, Grid, Typography} from '@mui/material';
import MediaTable from '../components/MediaTable';
import {useNavigate} from 'react-router-dom';

const MyFiles = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{maxWidth: 'lg', margin: 'auto'}}>
        <MediaTable myFilesOnly={true} />
      </Box>
    </>
  );
};

export default MyFiles;
