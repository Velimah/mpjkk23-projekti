import {
  Button,
  ImageListItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  useMediaQuery,
  Rating,
} from '@mui/material';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {mediaUrl, appId, profilePlaceholder} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useFavourite, useUser, useTag, useRating} from '../hooks/ApiHooks';
import {useTheme} from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  FiberManualRecord,
  MessageOutlined,
  Star,
  StarBorderOutlined,
} from '@mui/icons-material';
import {formatTime} from '../utils/UnitConversions';

const MediaRow = ({file, style, mediaArray}) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const {user, setTargetUser} = useContext(MediaContext);
  const description = JSON.parse(file.description);
  const {getUser} = useUser();
  const {postFavourite, deleteFavourite, getFavourites} = useFavourite();
  const {getTag} = useTag();
  const {postRating, deleteRating, getRatingsById} = useRating();

  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likesBoolean, setLikesBoolean] = useState(false);
  const [ratingBoolean, setRatingBoolean] = useState(false);
  const [profilePic, setProfilePic] = useState({
    filename: profilePlaceholder,
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
      if (user) {
        const token = localStorage.getItem('token');
        const ownerInfo = await getUser(file.user_id, token);
        setOwner(ownerInfo);
      }
    } catch (error) {
      console.error(error.message);
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
      if (error.message === 'Tag not found') {
        console.log('No profile picture');
      } else {
        console.error(error.message);
      }
    }
  };

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
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchComments = () => {
    setCommentCount(file.comments.length);
  };

  useEffect(() => {
    fetchUser();
    fetchProfilePicture();
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
    <Box component="div">
      <ImageListItem
        component={style ? Link : undefined}
        variant="contained"
        to="/single"
        state={{file}}
        onClick={() => {
          setTargetUser(file);
        }}
        sx={{
          borderBottom: style ? 0 : 1,
          '&:hover': {
            filter: style ? 'brightness(90%)' : 'brightness(100%)',
          },
        }}
      >
        {/* LISTING style user profile */}
        {!style && (
          <Grid
            container
            direction="row"
            sx={{
              alignItems: 'center',
              px: smallScreen ? 2 : 'auto',
              pt: 3,
              pb: 2,
            }}
          >
            <Avatar
              aria-label="Profile"
              component={Link}
              to={user?.user_id === file.user_id ? '/profile' : '/userprofiles'}
              state={{file}}
              onClick={() => {
                setTargetUser(file);
              }}
              sx={{ml: 1, boxShadow: 3, width: 45, height: 45}}
              src={profilePic.filename}
            />
            <Typography
              component={Link}
              to={user?.user_id === file.user_id ? '/profile' : '/userprofiles'}
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
              {owner.username || `User ${file.user_id}`}
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
          <img
            style={{
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
                : mediaUrl + file.thumbnails.w320
            }
            alt={file.title}
          />
        ) : (
          /* * LISTING STYLE * */
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
        )}
        {!style && (
          <Grid sx={{px: {xs: 1, md: 0}, pb: 3}}>
            <Grid
              sx={{pt: 1}}
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
                  <MessageOutlined
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
                    sx={{borderRadius: '20px', px: 0}}
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
                      <FavoriteIcon
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    {/* * MobileLikes show different text based on logged status * */}
                    <Typography component="p" variant="body1">
                      {user && (likesBoolean ? 'Unlike' : 'Like')}{' '}
                      {!user && `${likes} ${likes === 1 ? 'like' : 'likes'}`}
                      {user && `(${likes} ${likes === 1 ? 'like' : 'likes'})`}
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
                    sx={{borderRadius: '20px'}}
                  >
                    {/* * DesktopLikes check if user has liked or is not logged * */}
                    {likesBoolean || !user ? (
                      <FavoriteIcon
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{color: '#7047A6', mr: 1, fontSize: '1.6rem'}}
                      />
                    )}
                    {/* * MobileLikes show different text based on logged status and hover * */}
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
                    <IconButton sx={{borderRadius: '20px'}}>
                      {/* * MobileRating check if there are ratings * */}
                      {ratingCount ? (
                        <>
                          <Star
                            sx={{color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
                          />
                          <Typography component="p" variant="body1">
                            {Number(rating?.toFixed(1))} ({ratingCount}{' '}
                            {ratingCount > 1 ? 'ratings' : 'rating'})
                          </Typography>
                        </>
                      ) : (
                        <>
                          <StarBorderOutlined
                            sx={{color: '#7047A6', mr: 0.5, fontSize: '1.8rem'}}
                          />
                          <Typography component="p" variant="body1">
                            No ratings
                          </Typography>
                        </>
                      )}
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
                            <Rating
                              name="read-only"
                              size="large"
                              precision={0.2}
                              defaultValue={Number(rating?.toFixed(1))}
                              value={Number(rating?.toFixed(1))}
                              readOnly
                              icon={
                                <Star
                                  sx={{
                                    color: '#7047A6',
                                    fontSize: {xs: '1.2rem', sm: '1.6rem'},
                                  }}
                                />
                              }
                              emptyIcon={
                                <StarBorderOutlined
                                  sx={{
                                    color: '#7047A6',
                                    fontSize: {xs: '1.2rem', sm: '1.6rem'},
                                  }}
                                />
                              }
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
                                <Star
                                  sx={{
                                    color: '#7047A6',
                                    fontSize: {xs: '1.4rem', sm: '1.6rem'},
                                  }}
                                />
                              }
                              emptyIcon={
                                <StarBorderOutlined
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
                            <Star
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
                            <StarBorderOutlined
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
    </Box>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
  style: PropTypes.bool.isRequired,
  mediaArray: PropTypes.array.isRequired,
};

export default MediaRow;
