import {
  IconButton,
  ImageList,
  Grid,
  useMediaQuery,
  Container,
} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useState} from 'react';
import WindowIcon from '@mui/icons-material/Window';
import MenuIcon from '@mui/icons-material/Menu';
import {NavLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';

const MediaTable = ({
  myFilesOnly = false,
  sort,
  targetUserFilesOnly = false,
}) => {
  const {mediaArray, deleteMedia} = useMedia(myFilesOnly, targetUserFilesOnly);

  let sortedArray = mediaArray.slice().reverse();

  const [style, setStyle] = useState(true);
  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  if (sort === 2) {
    console.log('top rated');
  } else if (sort === 3) {
    console.log('most liked');
  } else {
    sortedArray = mediaArray.slice().reverse();
  }

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Container maxWidth="lg" sx={{padding: smallScreen ? 0 : 'auto'}}>
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
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <WindowIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={changeToGrid}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <WindowIcon />
            </IconButton>
          )}
          {style === false ? (
            <IconButton
              aria-label="list"
              onClick={changeToList}
              component={NavLink}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={changeToList}
              sx={{width: smallScreen ? '50%' : '150px'}}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Grid>

        <Grid
          container
          direction="row-reverse"
          alignItems="stretch"
          maxWidth="lg"
          justifyContent="center"
        >
          {/* * LIST STYLE * */}
          {style === false ? (
            <ImageList
              cols={1}
              gap={20}
              sx={{width: smallScreen ? '100%' : '500px'}}
            >
              {sortedArray.map((item, index) => {
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
            /* * GRID STYLE * */
            <ImageList
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              cols={smallScreen ? 3 : 4}
              rowHeight={smallScreen ? 100 : 300}
              gap={5}
              container
              direction="row"
              alignItems="stretch"
            >
              {sortedArray.map((item, index) => {
                return (
                  <MediaRow
                    key={index}
                    file={item}
                    deleteMedia={deleteMedia}
                    style={style}
                    sort={sort}
                  />
                );
              })}
            </ImageList>
          )}
        </Grid>
      </Container>
    </>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
  targetUserFilesOnly: PropTypes.bool,
  sort: PropTypes.any,
};

export default MediaTable;
