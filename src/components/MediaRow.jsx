import {Button, ImageListItem, ImageListItemBar} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';

const MediaRow = ({file}) => {
  return (
    <ImageListItem>
      <img
        src={
          file.media_type !== 'audio'
            ? mediaUrl + file.thumbnails.w320
            : '/vite.svg'
        }
        alt={file.title}
      />
      <ImageListItemBar
        title={file.title}
        subtitle={file.description.desc}
        sx={{
          '& .MuiImageListItemBar-title': {color: 'White', typography: 'h6'}, // styles for title
          '& .MuiImageListItemBar-subtitle': {
            color: 'White',
            typography: 'body2',
          }, // styles for subtitle
        }}
        actionIcon={
          <Button
            sx={{p: 1, m: 1}}
            component={Link}
            variant="contained"
            to="/single"
            state={{file}}
          >
            View
          </Button>
        }
      />
    </ImageListItem>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
};

export default MediaRow;
