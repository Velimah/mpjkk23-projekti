import {
  IconButton,
  ImageList,
  Grid,
  useMediaQuery,
  Container,
  Typography,
} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import WindowIcon from '@mui/icons-material/Window';
import MenuIcon from '@mui/icons-material/Menu';
import {NavLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';

const MediaTable = ({
  myFilesOnly = false,
  targetUserFilesOnly = false,
  myFavouritesOnly = false,
}) => {
  const {mediaArray, deleteMedia} = useMedia(
    myFilesOnly,
    targetUserFilesOnly,
    myFavouritesOnly
  );

  const [arrayLength, setArrayLength] = useState(0);

  useEffect(() => {
    setArrayLength(mediaArray.length);
  }, [mediaArray]);

  const [style, setStyle] = useState(true);
  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid sx={{mt: 3, mb: 3}}>
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {myFilesOnly || targetUserFilesOnly ? (
              <Typography component="h2" variant="h2" sx={{mb: 2}}>
                {arrayLength} {arrayLength === 1 ? 'post' : 'posts'}
              </Typography>
            ) : null}
            {!myFilesOnly && !targetUserFilesOnly ? (
              <Typography component="h2" variant="h2" sx={{mb: 2}}>
                Discover cats
              </Typography>
            ) : null}
            {/*
            <FormControl sx={{width: 150}}>
              <InputLabel id="select-label">Sort</InputLabel>
              <Select labelId="select-label" id="select" label="Sort">
                <MenuItem value={1}>Newest</MenuItem>
                <MenuItem value={2}>Most liked</MenuItem>
                <MenuItem value={3}>Top rated</MenuItem>
              </Select>
            </FormControl>
            */}
          </Grid>
        </Container>
      </Grid>
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
              gap={0}
              sx={{width: smallScreen ? '100%' : '500px'}}
            >
              {mediaArray
                .map((item, index) => {
                  return (
                    <MediaRow
                      key={index}
                      file={item}
                      deleteMedia={deleteMedia}
                      style={style}
                    />
                  );
                })
                .reverse()}
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
              {mediaArray
                .map((item, index) => {
                  return (
                    <MediaRow
                      key={index}
                      file={item}
                      deleteMedia={deleteMedia}
                      style={style}
                    />
                  );
                })
                .reverse()}
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
  myFavouritesOnly: PropTypes.bool,
};

export default MediaTable;
