import {Card, CardMedia, Typography} from '@mui/material';
import {useLocation} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';

const Single = () => {
  const {state} = useLocation();

  const file = state.file;

  return (
    <>
      <Typography component="h1" variant="h2">
        {file.title}
      </Typography>
      <Card>
        <CardMedia
          component={'img'}
          src={mediaUrl + file.filename}
          title={file.title}
        />
      </Card>
    </>
  );
};

// TODO in the next task: add propType for location

export default Single;
