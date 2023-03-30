import {Typography} from '@mui/material';
import { Box } from '@mui/system';
import MediaTable from '../components/MediaTable';

const Home = () => {
  return (
    <>
    <Box sx={{maxWidth:'lg', margin:'auto'}}>
      <Typography component="h1" variant="h2" textAlign='center' sx={{mt:10}}>
        Home
      </Typography>
      <MediaTable />
      </Box>
    </>
  );
};

export default Home;
