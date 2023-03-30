import {Card, CardMedia, Typography, Box} from '@mui/material';
import {useLocation} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';

const Single = () => {
  const {state} = useLocation();

  const file = state.file;

  return (
    <>
    <Box sx={{maxWidth:'lg', margin:'auto', mt:10}}>
      <Card>
      <Typography component="h1" variant="h3">
        {file.title}
      </Typography>
        <CardMedia
          component={'img'}
          src={mediaUrl + file.filename}
          title={file.title}
        />
      </Card>
      </Box>
    </>
  );
};

// TODO in the next task: add propType for location

export default Single;
