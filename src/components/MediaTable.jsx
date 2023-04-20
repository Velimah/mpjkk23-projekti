import {Button, IconButton, ImageList, Grid} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useState} from 'react';
import WindowIcon from '@mui/icons-material/Window';
import MenuIcon from '@mui/icons-material/Menu';
import {NavLink} from 'react-router-dom';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray, deleteMedia} = useMedia(myFilesOnly);

  const [style, setStyle] = useState(true);
  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        {style === true ? (
          <IconButton
            aria-label="window"
            onClick={changeToGrid}
            component={NavLink}
          >
            <WindowIcon />
          </IconButton>
        ) : (
          <IconButton onClick={changeToGrid}>
            <WindowIcon />
          </IconButton>
        )}
        {style === false ? (
          <IconButton
            aria-label="list"
            onClick={changeToList}
            component={NavLink}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton onClick={changeToList}>
            <MenuIcon />
          </IconButton>
        )}
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <ImageList
          sx={{width: '500', height: '500'}}
          cols={style ? '4' : '1'}
          rowHeight={style ? '450' : '150'}
          alignItems="stretch"
        >
          {mediaArray.map((item, index) => {
            return (
              <MediaRow key={index} file={item} deleteMedia={deleteMedia} />
            );
          })}
        </ImageList>
      </Grid>
    </>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
};

export default MediaTable;
