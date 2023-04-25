import {
  Button,
  ButtonGroup,
  ImageListItem,
  ImageListItemBar,
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
  console.log(file);

  return (
    <ImageListItem>
      <img
        src={
          file.media_type === 'audio'
            ? '/onlycats_logo.png'
            : file.mime_type === 'image/webp' || file.mime_type === 'image/avif'
            ? mediaUrl + file.filename
            : mediaUrl + file.thumbnails.w640
        }
        alt={file.title}
      />
      <ImageListItemBar
        title={file.title}
        subtitle={description.desc}
        sx={{
          '& .MuiImageListItemBar-title': {color: 'White', typography: 'h6'},
          '& .MuiImageListItemBar-subtitle': {
            color: 'White',
            typography: 'body2',
          },
        }}
        actionIcon={
          <ButtonGroup>
            <Button
              sx={{p: 1, m: 1}}
              component={Link}
              variant="contained"
              to="/single"
              state={{file}}
            >
              View
            </Button>
            {user && file.user_id === user.user_id && (
              <>
                <Button
                  sx={{p: 1, m: 1}}
                  component={Link}
                  variant="contained"
                  to="/modify"
                  state={{file}}
                >
                  Modify
                </Button>
                <Button
                  sx={{
                    p: 1,
                    m: 1,
                    backgroundColor: 'red',
                    '&:hover': {
                      backgroundColor: '#C41E3A !important',
                    },
                  }}
                  component={Link}
                  variant="contained"
                  onClick={doDelete}
                >
                  Delete
                </Button>
              </>
            )}
          </ButtonGroup>
        }
      />
    </ImageListItem>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  deleteMedia: PropTypes.func.isRequired,
};

export default MediaRow;
