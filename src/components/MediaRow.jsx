import {
  Button,
  ImageListItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl, appId} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useFavourite, useUser, useTag, useRating} from '../hooks/ApiHooks';
import {useTheme} from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const MediaRow = ({file, deleteMedia, style, sort}) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {user, setTargetUser} = useContext(MediaContext);
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
  const {getRatingsById} = useRating();

  const {getTag} = useTag();

  const [profilePic, setProfilePic] = useState({
    filename: '',
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
          setRefreshLikes(true);
        }
      });
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

  useEffect(() => {
    fetchUser();
    fetchLikes();
    fetchProfilePicture();
    fetchRatings();
  }, []);

  const doLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {file_id: file.file_id};
      const likeInfo = await postFavourite(data, token);
      setRefreshLikes(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [refreshLikes]);

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const likeInfo = await deleteFavourite(file.file_id, token);
      setRefreshLikes(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

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

  return (
    <Box component="div">
      <ImageListItem className="post" sx={{borderBottom: style ? 0 : 1}}>
        {/* LISTING style user profile */}
        {!style && (
          <Grid
            container
            direction="row"
            alignItems="center"
            sx={{px: smallScreen ? '5%' : 'auto', my: 3}}
          >
            <Avatar
              aria-label="Profile"
              component={Link}
              to="/userprofiles"
              state={{file}}
              onClick={() => {
                setTargetUser(file);
              }}
              sx={{boxShadow: 3}}
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
            onClick={() => {
              setTargetUser(file);
            }}
            sx={{height: '100%', width: '100%', objectFit: 'cover'}}
          >
            <img
              style={{
                height: '100%',
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
              src={
                file.media_type === 'audio'
                  ? '/onlycats_logo.png'
                  : file.mime_type === 'image/webp' ||
                    file.mime_type === 'image/avif'
                  ? mediaUrl + file.filename
                  : mediaUrl + file.thumbnails.w640
              }
              alt={file.title}
            />
          </Box>
        ) : (
          /* * LISTING STYLE * */
          <img
            style={{
              height: '100%',
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: smallScreen ? 0 : '5px',
            }}
            src={
              file.media_type === 'audio'
                ? '/onlycats_logo.png'
                : file.mime_type === 'image/webp' ||
                  file.mime_type === 'image/avif'
                ? mediaUrl + file.filename
                : mediaUrl + file.thumbnails.w640
            }
            alt={file.title}
          />
        )}
        {!style && (
          // TODO: make 2 rows max desc, it is only 1 row now..
          <Grid sx={{px: smallScreen ? '5%' : 'auto', py: 1, pb: 3}}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={2}
            >
              <Grid item>
                <IconButton
                  aria-label="favoriteIcon"
                  onClick={refreshLikes ? deleteLike : doLike}
                  variant="contained"
                >
                  {refreshLikes ? (
                    <FavoriteIcon sx={{color: '#7047A6'}} />
                  ) : (
                    <FavoriteBorderIcon sx={{color: '#7047A6'}} />
                  )}
                  <Typography component="p">
                    {refreshLikes ? 'Unlike' : 'Add a like'} ({likes} likes)
                  </Typography>
                </IconButton>
              </Grid>
              <Grid item>
                {/* TODO: if rating has been given, make icon filled */}
                <Box>
                  <IconButton aria-label="list" component={Link} to="/single">
                    <StarOutlineIcon sx={{color: '#7047A6'}} />
                    <Typography component="p">
                      {rating} ({ratingCount} ratings)
                    </Typography>
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Grid
              item
              style={{
                width: smallScreen ? 250 : 500,
                whiteSpace: 'nowrap',
              }}
            >
              <Typography
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  padding: '8px',
                }}
              >
                {description.desc}
              </Typography>
              <Button
                variant="text"
                component={Link}
                to="/single"
                state={{file}}
                onClick={() => {
                  setTargetUser(file);
                }}
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
};

export default MediaRow;
