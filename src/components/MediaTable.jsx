import {
  Button,
  IconButton,
  ImageList,
  Grid,
  useMediaQuery,
} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useState} from 'react';
import WindowIcon from '@mui/icons-material/Window';
import MenuIcon from '@mui/icons-material/Menu';
import {NavLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray, deleteMedia} = useMedia(myFilesOnly);

  const [style, setStyle] = useState(true);
  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('tablet'));

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        wrap="nowrap"
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
        {style === false ? (
          <ImageList
            cols={1}
            gap={50}
            sx={{width: smallScreen ? '100%' : '500px'}}
          >
            {mediaArray.map((item, index) => {
              return (
                <MediaRow
                  key={index}
                  file={item}
                  deleteMedia={deleteMedia}
                  style={style}
                />
              );
            })}
          </ImageList>
        ) : (
          <ImageList
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            cols={smallScreen ? 3 : 4}
            rowHeight={smallScreen ? 100 : 300}
            gap={5}
          >
            {mediaArray.map((item, index) => {
              return (
                <MediaRow
                  key={index}
                  file={item}
                  deleteMedia={deleteMedia}
                  style={style}
                />
              );
            })}
          </ImageList>
        )}
      </Grid>
    </>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
};

export default MediaTable;
