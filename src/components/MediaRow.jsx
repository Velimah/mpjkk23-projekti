import {
  Button,
  ImageListItem,
  Box,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
  Rating,
  Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useFavourite, useRating} from '../hooks/ApiHooks';
import {useTheme} from '@mui/material/styles';
import {
  FavoriteBorderRounded,
  FavoriteRounded,
  MessageRounded,
  StarBorderRounded,
  StarRounded,
} from '@mui/icons-material';
import UserHeader from './UserHeader';

const MediaRow = ({file, style, mediaArray}) => {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const description = JSON.parse(file.description);

  const {user, setTargetUser, setToastSnackbar, setToastSnackbarOpen} =
    useContext(MediaContext);
  const {postFavourite, deleteFavourite, getFavourites} = useFavourite();
  const {postRating, deleteRating, getRatingsById} = useRating();

  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likesBoolean, setLikesBoolean] = useState(false);
  const [ratingBoolean, setRatingBoolean] = useState(false);

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

  const fetchLikesInitial = () => {
    setLikes(file.likes.length);
    if (user) {
      file.likes.forEach((like) => {
        if (like.user_id === user.user_id) {
          setLikesBoolean(true);
        }
      });
    }
  };

  const fetchLikes = async () => {
    try {
      const likeInfo = await getFavourites(file.file_id);
      setLikes(likeInfo.length);
      likeInfo.forEach((like) => {
        if (like.user_id === user.user_id) {
          setLikesBoolean(true);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const doLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const fileId = {file_id: file.file_id};
      const liked = await postFavourite(fileId, token);
      setLikesBoolean(true);
      fetchLikes();
      console.log('liked', liked);
      setToastSnackbar({
        severity: 'success',
        message: 'Like added',
      });
      setToastSnackbarOpen(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const notliked = await deleteFavourite(file.file_id, token);
      setLikesBoolean(false);
      fetchLikes();
      console.log('unliked', notliked);
      setToastSnackbar({
        severity: 'success',
        message: 'Like removed',
      });
      setToastSnackbarOpen(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRatingsInitial = () => {
    setRatingCount(file.ratings.length);
    setRating(file.averageRating);
    if (user) {
      file.ratings.forEach((file) => {
        if (file.user_id === user.user_id) {
          setRatingBoolean(true);
        }
      });
    }
  };

  const fetchRatingsUpdate = async () => {
    try {
      const ratingInfo = await getRatingsById(file.file_id);
      let sum = 0;
      setRatingCount(ratingInfo.length);
      if (user) {
        ratingInfo.forEach((file) => {
          sum += file.rating;
          if (file.user_id === user.user_id) {
            setRatingBoolean(true);
          }
        });
      }
      const averageRating = sum / ratingInfo.length;
      setRating(averageRating);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doRating = async (value) => {
    try {
      const token = localStorage.getItem('token');
      const data2 = {file_id: file.file_id, rating: value};
      const ratingInfo = await postRating(data2, token);
      console.log('rated', ratingInfo);
      setRatingBoolean(!ratingBoolean);
      fetchRatingsUpdate();
      setToastSnackbar({
        severity: 'success',
        message: 'Rating added',
      });
      setToastSnackbarOpen(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doDeleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      const ratingInfo = await deleteRating(file.file_id, token);
      console.log('unrated', ratingInfo);
      setRatingBoolean(!ratingBoolean);
      fetchRatingsUpdate();
      setToastSnackbar({
        severity: 'success',
        message: 'Rating removed',
      });
      setToastSnackbarOpen(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchComments = () => {
    setCommentCount(file.comments.length);
  };

  useEffect(() => {
    fetchComments();
    fetchLikesInitial();
    fetchRatingsInitial();
  }, [mediaArray]);

  const [likesHoverBoolean, setLikesHoverBoolean] = useState(false);
  const [ratingHoverBoolean, setRatingHoverBoolean] = useState(false);
  const handleMouseOverRating = () => {
    setRatingHoverBoolean(true);
  };
  const handleMouseOutRating = () => {
    setRatingHoverBoolean(false);
  };
  const handleMouseOverLikes = () => {
    setLikesHoverBoolean(true);
  };
  const handleMouseOutLikes = () => {
    setLikesHoverBoolean(false);
  };

  return (
    <Paper
      component="div"
      sx={{
        my: style ? 0 : 1,
        mx: style ? 0 : {sx: 0, md: 1},
        backgroundColor: style ? 'transparent' : '#FFFFFF',
        borderRadius: style ? 0 : 3,
      }}
      elevation={style ? 0 : 4}
    >
      <ImageListItem
        component={style ? Link : undefined}
        variant="contained"
        to="/single"
        state={{file}}
        onClick={() => {
          setTargetUser(file);
        }}
        sx={{
          '&:hover': {
            filter: style ? 'brightness(90%)' : 'brightness(100%)',
          },
        }}
      >
        {/* LISTING style user profile */}
        {!style && (
          <Box sx={{mt: 2, mx: 3}}>
            <UserHeader file={file} postSettings={true} />
          </Box>
        )}
        {/* * GRID STYLE * */}
        {style === true ? (
          <img
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: 12,
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
                : mediaUrl + file.thumbnails.w320
            }
            alt={file.title}
          />
        ) : (
          /* * LISTING STYLE * */
          <Box
            component={Link}
            onClick={() => {
              setTargetUser(file);
            }}
            state={{file}}
            to="/single"
          >
            <img
              style={{
                height: '100%',
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
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
          <Grid sx={{p: 2, py: 1}}>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Grid item>
                <IconButton
                  component={Link}
                  to="/single"
                  state={{file}}
                  onClick={() => {
                    setTargetUser(file);
                  }}
                  sx={{borderRadius: '20px'}}
                >
                  <MessageRounded
                    sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                  />
                  <Typography component="p" variant="body1" sx={{p: 0}}>
                    {commentCount}
                  </Typography>
                </IconButton>
              </Grid>
              {/* * MobileLikes * */}
              {mediumScreen ? (
                <Grid item>
                  <IconButton
                    sx={{borderRadius: '2rem', px: 0}}
                    aria-label="favoriteIcon"
                    onClick={() => {
                      if (user) {
                        likesBoolean ? deleteLike() : doLike();
                      }
                    }}
                    variant="contained"
                  >
                    {/* * MobileLikes check if user has liked or is not logged * */}
                    {likesBoolean || !user ? (
                      <FavoriteRounded
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    ) : (
                      <FavoriteBorderRounded
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    {/* * MobileLikes show different text based on logged status * */}
                    <Typography component="p" variant="body1">
                      {likes} {likes === 1 ? 'like' : 'likes'}
                    </Typography>
                  </IconButton>
                </Grid>
              ) : (
                <Grid item>
                  {/* * DesktopLikes * */}
                  <IconButton
                    aria-label="favoriteIcon"
                    onClick={() => {
                      if (user) {
                        likesBoolean ? deleteLike() : doLike();
                      }
                    }}
                    variant="contained"
                    onMouseOver={handleMouseOverLikes}
                    onMouseOut={handleMouseOutLikes}
                    sx={{borderRadius: '2rem'}}
                  >
                    {likesBoolean && likesHoverBoolean && (
                      <FavoriteBorderRounded
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    {!likesBoolean && likesHoverBoolean && (
                      <FavoriteRounded
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    {!likesBoolean && !likesHoverBoolean && (
                      <FavoriteBorderRounded
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    {likesBoolean && !likesHoverBoolean && (
                      <FavoriteRounded
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    <Typography component="p" variant="body1">
                      {user &&
                        (likesBoolean
                          ? likesHoverBoolean
                            ? 'Unlike'
                            : ''
                          : likesHoverBoolean
                          ? 'Add a like'
                          : '')}
                      {user && likesHoverBoolean
                        ? null
                        : `${likes} ${likes === 1 ? 'like' : 'likes'}`}
                    </Typography>
                  </IconButton>
                </Grid>
              )}
              {/* * MobileRating * */}
              {mediumScreen ? (
                <Grid item>
                  <Box>
                    <IconButton sx={{borderRadius: '2rem'}}>
                      {ratingCount ? (
                        <StarRounded
                          sx={{color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
                        />
                      ) : (
                        <StarBorderRounded
                          sx={{color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
                        />
                      )}
                      <Typography component="p" variant="body1">
                        {Number(rating?.toFixed(1))} ({ratingCount}{' '}
                        {ratingCount !== 1 ? 'ratings' : 'rating'})
                      </Typography>
                    </IconButton>
                  </Box>
                </Grid>
              ) : (
                <Grid item>
                  {/* * DesktopRating * */}
                  <Box
                    onMouseOver={() => {
                      if (user) {
                        handleMouseOverRating();
                      }
                    }}
                    onMouseOut={() => {
                      if (user) {
                        handleMouseOutRating();
                      }
                    }}
                  >
                    {ratingHoverBoolean ? (
                      <Grid item>
                        {ratingBoolean ? (
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              if (user) {
                                doDeleteRating();
                              }
                            }}
                            onMouseOver={handleMouseOverRating}
                            onMouseOut={handleMouseOutRating}
                            sx={{borderRadius: '20px'}}
                          >
                            <StarRounded
                              sx={{
                                color: '#7047A6',
                                fontSize: {xs: '1.2rem', sm: '1.6rem'},
                              }}
                            />
                            <Typography
                              sx={{ml: 1}}
                              component="p"
                              variant="body1"
                            >
                              {ratingHoverBoolean
                                ? 'Remove rating'
                                : `${Number(
                                    rating?.toFixed(1)
                                  )} (${ratingCount} ${
                                    ratingCount === 1 ? 'rating' : 'ratings'
                                  })`}
                            </Typography>
                          </IconButton>
                        ) : (
                          <IconButton
                            onMouseOver={handleMouseOverRating}
                            onMouseOut={handleMouseOutRating}
                            sx={{borderRadius: '20px'}}
                          >
                            <Rating
                              name="simple-controlled"
                              size="large"
                              value={Number(rating?.toFixed(1))}
                              precision={1}
                              onChange={(event, newValue) => {
                                event.stopPropagation();
                                if (user) {
                                  doRating(newValue);
                                }
                              }}
                              icon={
                                <StarRounded
                                  sx={{
                                    color: '#7047A6',
                                    fontSize: {xs: '1.4rem', sm: '1.6rem'},
                                  }}
                                />
                              }
                              emptyIcon={
                                <StarBorderRounded
                                  sx={{
                                    color: '#7047A6',
                                    fontSize: {xs: '1.4rem', sm: '1.6rem'},
                                  }}
                                />
                              }
                            />
                            {ratingCount ? (
                              <Typography
                                sx={{ml: 1}}
                                component="p"
                                variant="body1"
                              >
                                {ratingHoverBoolean
                                  ? 'Add a rating'
                                  : `${Number(
                                      rating?.toFixed(1)
                                    )} (${ratingCount} ${
                                      ratingCount === 1 ? 'rating' : 'ratings'
                                    })`}
                              </Typography>
                            ) : (
                              <Typography
                                sx={{ml: 1}}
                                component="p"
                                variant="body1"
                              >
                                {' '}
                                {ratingHoverBoolean
                                  ? 'Add a rating'
                                  : 'No ratings'}
                              </Typography>
                            )}
                          </IconButton>
                        )}
                      </Grid>
                    ) : (
                      <IconButton sx={{borderRadius: '20px'}}>
                        {ratingCount ? (
                          <>
                            <StarRounded
                              sx={{
                                color: '#7047A6',
                                mr: 0.5,
                                fontSize: '1.6rem',
                              }}
                            />
                            <Typography component="p" variant="body1">
                              {Number(rating?.toFixed(1))} ({ratingCount}{' '}
                              {ratingCount === 1 ? 'rating' : 'ratings'})
                            </Typography>
                          </>
                        ) : (
                          <>
                            <StarBorderRounded
                              sx={{
                                color: '#7047A6',
                                mr: 0.5,
                                fontSize: '1.6rem',
                              }}
                            />
                            <Typography component="p" variant="body1">
                              {ratingCount
                                ? `${Number(
                                    rating?.toFixed(1)
                                  )} (${ratingCount} ${
                                    ratingCount === 1 ? 'rating' : 'ratings'
                                  })`
                                : 'No ratings'}
                            </Typography>
                          </>
                        )}
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
            <Grid item>
              <Typography
                component="p"
                variant="body1"
                sx={{
                  maxHeight: '60px',
                  p: description.desc.length === 0 ? 0 : 1,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  textOverflow: 'ellipsis',
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {description.desc}
              </Typography>

              <Button
                variant="text"
                component={Link}
                sx={{fontWeight: 600}}
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
    </Paper>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  style: PropTypes.bool.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaRow;
