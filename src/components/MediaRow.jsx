import {
  Button,
  ImageListItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Rating,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl, appId} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {
  useFavourite,
  useUser,
  useTag,
  useMedia,
  useRating,
} from '../hooks/ApiHooks';
import {useTheme} from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const MediaRow = ({file, deleteMedia, style, sort}) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {user, update, setUpdate} = useContext(MediaContext);
  const description = JSON.parse(file.description);

  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const [refreshLikes, setRefreshLikes] = useState(false);
  const [refreshRating, setRefreshRating] = useState(false);

  const {getUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();

  const {getTag} = useTag();

  const {getMediaById} = useMedia();

  const {postRating, deleteRating, getRatingsById} = useRating();

  const [profilePic, setProfilePic] = useState({
    filename: 'https://placekitten.com/200/200',
  });

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

  const fetchProfilePicture = async () => {
    try {
      const profilePictures = await getTag(
        appId + '_profilepicture_' + file.user_id
      );
      const profilePicture = profilePictures.pop();
      profilePicture.filename = mediaUrl + profilePicture.filename;
      setProfilePic(profilePicture);
    } catch (error) {
      console.error(error.message);
    }
  };

  const doRating = async (value) => {
    try {
      const token = localStorage.getItem('token');
      const data = {file_id: file.file_id, rating: value};
      const ratingInfo = await postRating(data, token);
      console.log(ratingInfo);
      setRefreshRating(!refreshRating);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doDeleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      const ratingInfo = await deleteRating(file.file_id, token);
      console.log(ratingInfo);
      setRefreshRating(!refreshRating);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRatings = async () => {
    try {
      const ratingInfo = await getRatingsById(file.file_id);
      let sum = 0;
      setRatingCount(ratingInfo.length);

      ratingInfo.forEach((file) => {
        sum += file.rating;
        if (file.user_id === user.user_id) {
          setRefreshRating(true);
        }
      });
      const averageRating = sum / ratingInfo.length;
      setRating(averageRating);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [refreshRating]);

  useEffect(() => {
    fetchUser();
    fetchLikes();
    fetchProfilePicture();
    fetchRatings();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);
  return (
    <Box component="div">
      <ImageListItem sx={{boxShadow: !style & !smallScreen ? 1 : 0}}>
        {!style && (
          <Grid
            container
            direction="row"
            alignItems="center"
            sx={{px: smallScreen ? '5%' : 'auto'}}
          >
            <Avatar
              aria-label="Profile"
              component={Link}
              to="/profile"
              sx={{my: 3, boxShadow: 3}}
              src={profilePic.filename}
            />
            <Typography component="p" sx={{pl: 1}}>
              {owner.username}
            </Typography>
          </Grid>
        )}
        {/* * GRID STYLE * */}
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
          /* * LISTING STYLE * */
          <Box
            component="img"
            sx={{
              height: '350px',
              width: '100%',
              objectFit: 'cover',
              borderRadius: smallScreen ? 0 : '10px',
            }}
            src={
              file.media_type !== 'audio'
                ? mediaUrl + file.thumbnails.w640
                : '/onlycats_logo.png'
            }
            alt={file.title}
          />
        )}
        {!style && (
          // TODO: make 2 rows max desc
          <Grid sx={{px: smallScreen ? '5%' : 'auto'}}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{py: '15px'}}
            >
              <Grid item>
                <IconButton
                  aria-label="favoriteBorderIcon"
                  onClick={doLike}
                  sx={{width: '100%'}}
                >
                  <FavoriteBorderIcon />{' '}
                  <Typography component="p">
                    Add a like ({likes} likes)
                  </Typography>
                </IconButton>
              </Grid>
              <Grid item>
                {refreshRating ? (
                  <Box sx={{mt: 1}}>
                    <Rating
                      name="read-only"
                      size="large"
                      precision={0.2}
                      defaultValue={parseFloat(rating.toFixed(2))}
                      value={parseFloat(rating.toFixed(2))}
                      readOnly
                    />
                    <Typography component="legend">
                      {parseFloat(rating.toFixed(2))} ({parseFloat(ratingCount)}{' '}
                      ratings)
                    </Typography>
                    <Button onClick={doDeleteRating} variant="contained">
                      delete rating
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <IconButton aria-label="list">
                      <StarOutlineIcon />
                      <Typography component="p">
                        {rating} ({ratingCount} ratings)
                      </Typography>
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Typography component="p" sx={{mb: 3}}>
                {description.desc}{' '}
              </Typography>
              <Button
                variant="text"
                component={Link}
                to="/single"
                state={{file}}
              >
                Show more
              </Button>
            </Grid>
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
  sort: PropTypes.any.isRequired,
};

export default MediaRow;
