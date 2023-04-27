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
import {FiberManualRecord, Star, StarBorderOutlined} from '@mui/icons-material';
import {formatTime} from '../utils/UnitConversions';

const MediaRow = ({file, style}) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {user, setTargetUser} = useContext(MediaContext);
  const description = JSON.parse(file.description);

  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
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

  let allData = {
    desc: file.description,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
    },
  };
  try {
    allData = JSON.parse(file.description);
  } catch (error) {
    console.log(allData);
  }

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
      const fileId = {file_id: file.file_id};
      await postFavourite(fileId, token);
      setRefreshLikes(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteFavourite(file.file_id, token);
      setRefreshLikes(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [refreshLikes]);

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
            sx={{px: smallScreen ? 2 : 'auto', pt: 3, pb: 2}}
          >
            <Avatar
              aria-label="Profile"
              component={Link}
              to="/userprofiles"
              state={{file}}
              onClick={() => {
                setTargetUser(file);
              }}
              sx={{ml: 1, boxShadow: 3, width: 45, height: 45}}
              src={profilePic.filename}
            />
            <Typography
              component={Link}
              to="/userprofiles"
              state={{file}}
              onClick={() => {
                setTargetUser(file);
              }}
              variant="h1"
              sx={{
                pl: 2,
                fontSize: '1.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {owner.username}
            </Typography>
            <FiberManualRecord
              sx={{
                m: 2,
                fontSize: '0.4rem',
              }}
            ></FiberManualRecord>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.3rem',
              }}
            >
              {formatTime(file.time_added)}
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
                filter: `brightness(${allData.filters.brightness}%)
                       contrast(${allData.filters.contrast}%)
                       saturate(${allData.filters.saturation}%)
                       sepia(${allData.filters.sepia}%)`,
              }}
              src={
                file.media_type === 'audio'
                  ? 'onlycats_logo.png'
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
                borderRadius: smallScreen ? 0 : '5px',
                filter: `brightness(${allData.filters.brightness}%)
                       contrast(${allData.filters.contrast}%)
                       saturate(${allData.filters.saturation}%)
                       sepia(${allData.filters.sepia}%)`,
              }}
              src={
                file.media_type === 'audio'
                  ? 'onlycats_logo.png'
                  : file.mime_type === 'image/webp' ||
                    file.mime_type === 'image/avif'
                  ? mediaUrl + file.filename
                  : mediaUrl + file.thumbnails.w640
              }
              alt={file.title}
            />
          </Box>
        )}
        {!style && (
          // TODO: make 2 rows max desc, it is only 1 row now..
          <Grid sx={{px: {xs: 2, md: 0}, pb: 3}}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <IconButton
                  aria-label="favoriteIcon"
                  onClick={refreshLikes ? deleteLike : doLike}
                  variant="contained"
                >
                  {refreshLikes ? (
                    <FavoriteIcon
                      sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                    />
                  )}
                  <Typography component="p" variant="body1">
                    {refreshLikes ? 'Unlike' : 'Add a like'} ({likes}{' '}
                    {likes > 1 ? 'likes' : 'like'})
                  </Typography>
                </IconButton>
              </Grid>
              <Grid item>
                <Box>
                  <IconButton aria-label="list">
                    {ratingCount ? (
                      <>
                        <Star
                          sx={{color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
                        />
                        <Typography component="p" variant="body1">
                          {rating.toFixed(1)} ({ratingCount}{' '}
                          {ratingCount > 1 ? 'ratings' : 'rating'})
                        </Typography>
                      </>
                    ) : (
                      <>
                        <StarBorderOutlined
                          sx={{color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
                        />
                        <Typography component="p" variant="body1">
                          No ratings yet
                        </Typography>
                      </>
                    )}
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                component="p"
                variant="body1"
                sx={{
                  maxHeight: '85px',
                  p: description.desc.length === 0 ? 0 : 1,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  textOverflow: 'ellipsis',
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {description.desc}
              </Typography>
              {description.desc.length !== 0 && (
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
              )}
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
  style: PropTypes.bool.isRequired,
};

export default MediaRow;
