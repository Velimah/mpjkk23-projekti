import {
  IconButton,
  ImageList,
  Grid,
  useMediaQuery,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  const {mediaArray, deleteMedia, getMedia} = useMedia(
    myFilesOnly,
    targetUserFilesOnly,
    myFavouritesOnly
  );
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [style, setStyle] = useState(true);
  const [selectedOption, setSelectedOption] = useState('file_id');
  const [arrayLength, setArrayLength] = useState(0);

  useEffect(() => {
    getMedia();
  }, []);

  useEffect(() => {
    setArrayLength(mediaArray.length);
  }, [mediaArray]);

  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === 1) {
      setSelectedOption('file_id');
    } else if (value === 2) {
      setSelectedOption('likes');
    } else if (value === 3) {
      setSelectedOption('rating');
    }
  };

  return (
    <>
      <Grid sx={{mt: 3, mb: 3}}>
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            {myFilesOnly || targetUserFilesOnly ? (
              <Typography component="h2" variant="h2" sx={{mb: 2}}>
                {arrayLength} {arrayLength === 1 ? 'post' : 'posts'}
              </Typography>
            ) : null}
            {myFavouritesOnly ? (
              <Typography component="h2" variant="h2" sx={{mb: 2}}>
                {`Posts you have liked (${arrayLength})`}
              </Typography>
            ) : null}
            {!myFilesOnly && !targetUserFilesOnly && !myFavouritesOnly ? (
              <Typography component="h2" variant="h2" sx={{mb: 2}}>
                Discover cats
              </Typography>
            ) : null}
            <FormControl sx={{width: 150}}>
              <InputLabel id="select-label">Sort</InputLabel>
              <Select
                defaultValue={1}
                onChange={handleChange}
                labelId="select-label"
                id="select"
                label="Sort"
              >
                <MenuItem value={1}>Newest</MenuItem>
                <MenuItem value={2}>Most liked</MenuItem>
                <MenuItem value={3}>Top rated</MenuItem>
              </Select>
            </FormControl>
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
              {selectedOption === 'rating' &&
                [...mediaArray]
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .map((item, index) => {
                    return (
                      <MediaRow
                        key={index}
                        file={item}
                        deleteMedia={deleteMedia}
                        style={style}
                      />
                    );
                  })}
              {selectedOption === 'likes' &&
                [...mediaArray]
                  .sort((a, b) => b.likes.length - a.likes.length)
                  .map((item, index) => {
                    return (
                      <MediaRow
                        key={index}
                        file={item}
                        deleteMedia={deleteMedia}
                        style={style}
                      />
                    );
                  })}
              {selectedOption === 'file_id' &&
                [...mediaArray]
                  .sort((a, b) => b.file_id - a.file_id)
                  .map((item, index) => {
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
                objectFit: 'contain',
              }}
              cols={smallScreen ? 3 : 4}
              container
              direction="row"
              alignItems="stretch"
            >
              {selectedOption === 'rating' &&
                [...mediaArray]
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .map((item, index) => {
                    return (
                      <MediaRow
                        key={index}
                        file={item}
                        deleteMedia={deleteMedia}
                        style={style}
                      />
                    );
                  })}
              {selectedOption === 'likes' &&
                [...mediaArray]
                  .sort((a, b) => b.likes.length - a.likes.length)
                  .map((item, index) => {
                    return (
                      <MediaRow
                        key={index}
                        file={item}
                        deleteMedia={deleteMedia}
                        style={style}
                      />
                    );
                  })}
              {selectedOption === 'file_id' &&
                [...mediaArray]
                  .sort((a, b) => b.file_id - a.file_id)
                  .map((item, index) => {
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
