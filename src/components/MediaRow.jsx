import {
  Button,
  ButtonGroup,
  ImageListItem,
  ImageListItemBar,
  Box,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useFavourite, useUser} from '../hooks/ApiHooks';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const MediaRow = ({file, deleteMedia, style}) => {
  const {user, update, setUpdate} = useContext(MediaContext);
  const description = JSON.parse(file.description);

  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);

  const {getUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const ownerInfo = await getUser(file.user_id, token);
      setOwner(ownerInfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchLikes = async () => {
    try {
      const likeInfo = await getFavourites(file.file_id);
      setLikes(likeInfo.length);
      likeInfo.forEach((like) => {
        if (like.user_id === user.user_id) {
          setUserLike(true);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const doLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {file_id: file.file_id};
      const likeInfo = await postFavourite(data, token);
      setUserLike(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const likeInfo = await deleteFavourite(file.file_id, token);
      setUserLike(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLikes();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  return (
    <Box component="div">
      <ImageListItem>
        {!style && (
          <Typography component="h2" variant="h2">
            {owner.username}
          </Typography>
        )}
        {style === true ? (
          <Box
            component={Link}
            variant="contained"
            to="/single"
            state={{file}}
            sx={{height: '100%', width: '100%', objectFit: 'cover'}}
          >
            <Box
              component="img"
              sx={{height: '100%', width: '100%', objectFit: 'cover'}}
              src={
                file.media_type !== 'audio'
                  ? mediaUrl + file.thumbnails.w640
                  : '/onlycats_logo.png'
              }
              alt={file.title}
            />
          </Box>
        ) : (
          <Box
            component="img"
            sx={{height: '350px', width: '100%', objectFit: 'cover'}}
            src={
              file.media_type !== 'audio'
                ? mediaUrl + file.thumbnails.w640
                : '/onlycats_logo.png'
            }
            alt={file.title}
          />
        )}
        {!style && (
          // TODO: make 2 rows max desc, add ratings
          <Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <IconButton aria-label="favoriteBorderIcon" onClick={doLike}>
                  <FavoriteBorderIcon />{' '}
                  <Typography component="p">
                    Add a like ({likes} likes)
                  </Typography>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton aria-label="ratingBorderIcon" onClick={doLike}>
                  <StarOutlineIcon />{' '}
                  <Typography component="p">Ratings</Typography>
                </IconButton>
              </Grid>
            </Grid>
            <Typography component="p">{description.desc} </Typography>
            <Button variant="text" component={Link} to="/single" state={{file}}>
              Show more
            </Button>
          </Grid>
        )}
      </ImageListItem>
    </Box>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  style: PropTypes.any.isRequired,
};

export default MediaRow;
