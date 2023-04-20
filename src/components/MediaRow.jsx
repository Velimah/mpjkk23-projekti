import {
  Button,
  ButtonGroup,
  ImageListItem,
  ImageListItemBar,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';

const MediaRow = ({file, deleteMedia}) => {
  const {user, update, setUpdate} = useContext(MediaContext);
  const description = JSON.parse(file.description);

  const doDelete = async () => {
    const sure = confirm('Are you sure?');
    if (sure) {
      const token = localStorage.getItem('token');
      const deleteResult = await deleteMedia(file.file_id, token);
      console.log(deleteResult);
      setUpdate(!update);
    }
  };

  return (
    <ImageListItem>
      <Box component={Link} variant="contained" to="/single" state={{file}}>
        <img
          src={
            file.media_type !== 'audio'
              ? mediaUrl + file.thumbnails.w640
              : '/vite.svg'
          }
          alt={file.title}
        />
      </Box>
    </ImageListItem>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  deleteMedia: PropTypes.func.isRequired,
};

export default MediaRow;
