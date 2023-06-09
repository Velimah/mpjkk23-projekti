import {
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  IconButton,
  Container,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import {mediaUrl, appId} from '../utils/variables';
import {useFavourite, useComment, useRating, useTag} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import CommentRow from '../components/CommentRow';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import useForm from '../hooks/FormHooks';
import {commentErrorMessages} from '../utils/errorMessages';
import {commentValidators} from '../utils/validator';
import {
  FavoriteBorderRounded,
  FavoriteRounded,
  SendRounded,
  StarBorderRounded,
  StarRounded,
} from '@mui/icons-material';
import UserHeader from '../components/UserHeader';
import AlertDialog from '../components/AlertDialog';
import {useTheme} from '@emotion/react';

const Single = () => {
  const {user, setToastSnackbar, setToastSnackbarOpen} =
    useContext(MediaContext);
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [commentArray, setCommentArray] = useState([]);
  const [tagArray, setTagArray] = useState([]);
  const [showComments, setShowComments] = useState(3);
  const [likeFailedDialogOpen, setLikeFailedDialogOpen] = useState(false);
  const [ratingFailedDialogOpen, setRatingFailedDialogOpen] = useState(false);

  const [refreshLikes, setRefreshLikes] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  const [refreshRating, setRefreshRating] = useState(false);

  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );

  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const {postComment, getCommentsById} = useComment();
  const {postRating, deleteRating, getRatingsById} = useRating();
  const {getTagsByFileId} = useTag();

  const {state} = useLocation();

  // checks for targetUser and if null gets targetUser information from localstorage
  const [data, setData] = useState(() => {
    return state?.file ?? JSON.parse(window.localStorage.getItem('targetUser'));
  });

  // when data changes, saves data to localstorage and updates data
  useEffect(() => {
    window.localStorage.setItem('targetUser', JSON.stringify(data));
  }, [setData]);

  // checks for user and if null gets user information from localstorage
  const [userData, setUserData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

  // when tUserData changes, saves UserData to localstorage and updates UserData
  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(userData));
    setUserData(userData);
  }, [setUserData]);

  let allData = {
    desc: data.description,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
    },
  };
  try {
    allData = JSON.parse(data.description);
  } catch (error) {
    console.error(allData);
  }

  let componentType = 'img';
  switch (data.media_type) {
    case 'video':
      componentType = 'video';
      break;
    case 'audio':
      componentType = 'audio';
      break;
  }

  const fetchLikes = async () => {
    try {
      const likeInfo = await getFavourites(data.file_id);
      setLikes(likeInfo.length);
      likeInfo.forEach((like) => {
        if (user && like.user_id === user.user_id) {
          setRefreshLikes(true);
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const commentInfo = await getCommentsById(data.file_id);
      setCommentCount(commentInfo.length);
      setCommentArray(commentInfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchTags = async () => {
    try {
      const tagInfo = await getTagsByFileId(data.file_id);
      setTagArray(tagInfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
    fetchComments();
    fetchRatings();
    fetchTags();
  }, []);

  const doLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const fileId = {file_id: data.file_id};
        await postFavourite(fileId, token);
        setRefreshLikes(true);
        setToastSnackbar({
          severity: 'success',
          message: 'Like added',
        });
        setToastSnackbarOpen(true);
      } else {
        setLikeFailedDialogOpen(true);
      }
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [refreshLikes]);

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await deleteFavourite(data.file_id, token);
        setRefreshLikes(false);
        setToastSnackbar({
          severity: 'success',
          message: 'Like removed',
        });
        setToastSnackbarOpen(true);
      }
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const doComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const data2 = {file_id: data.file_id, comment: inputs.comment};
        const commentInfo = await postComment(data2, token);
        setToastSnackbar({severity: 'success', message: commentInfo.message});
        setToastSnackbarOpen(true);
        setRefreshComments(!refreshComments);
        inputs.comment = '';
      }
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [refreshComments]);

  const initValues = {
    comment: '',
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doComment,
    initValues
  );

  const doRating = async (value) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const data2 = {file_id: data.file_id, rating: value};
        const ratingInfo = await postRating(data2, token);
        console.log(ratingInfo);
        setRefreshRating(!refreshRating);
        setToastSnackbar({
          severity: 'success',
          message: 'Rating added',
        });
        setToastSnackbarOpen(true);
      } else {
        setRatingFailedDialogOpen(true);
      }
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const doDeleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const ratingInfo = await deleteRating(data.file_id, token);
        console.log(ratingInfo);
        setRefreshRating(!refreshRating);
        setToastSnackbar({
          severity: 'success',
          message: 'Rating removed',
        });
        setToastSnackbarOpen(true);
      }
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error.message);
    }
  };

  const fetchRatings = async () => {
    try {
      const ratingInfo = await getRatingsById(data.file_id);
      let sum = 0;
      setRatingCount(ratingInfo.length);

      ratingInfo.forEach((file) => {
        sum += file.rating;
        if (user && file.user_id === user.user_id) {
          setRefreshRating(true);
        }
      });
      let averageRating = sum / ratingInfo.length;
      if (isNaN(averageRating)) {
        averageRating = 0;
      }
      setRating(averageRating);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [refreshRating]);

  // mouseovers for likes and ratings
  const [showTextLikes, setShowTextLikes] = useState(false);
  const [showTextRating, setShowTextRating] = useState(false);
  const handleMouseOverRating = () => {
    setShowTextRating(true);
  };
  const handleMouseOutRating = () => {
    setShowTextRating(false);
  };
  const handleMouseOverLikes = () => {
    setShowTextLikes(true);
  };
  const handleMouseOutLikes = () => {
    setShowTextLikes(false);
  };

  return (
    <>
      <Container maxWidth="sm" sx={{mt: {xs: 8, sm: 3}, px: {xs: 3, sm: 0}}}>
        <UserHeader file={data} postSettings={true} />
      </Container>
      <Container maxWidth="sm" sx={{p: {xs: 0}}}>
        {componentType === 'img' && (
          <img
            src={mediaUrl + data.filename}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: extraSmallScreen ? 0 : '1.25rem',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              filter: `brightness(${allData.filters.brightness}%)
        contrast(${allData.filters.contrast}%)
        saturate(${allData.filters.saturation}%)
        sepia(${allData.filters.sepia}%)`,
            }}
          />
        )}
        {componentType === 'video' && (
          <video
            controls
            style={{
              width: '100%',
              height: '100%',
              borderRadius: extraSmallScreen ? 0 : '1.25rem',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            }}
          >
            <source src={mediaUrl + data.filename}></source>
          </video>
        )}
      </Container>
      <Container maxWidth="sm" sx={{mb: {xs: 10, sm: 7}, px: {xs: 3, sm: 0}}}>
        <Box sx={{mt: 3, mb: 4}}>
          <Typography component="p" variant="body2">
            {allData.desc}
          </Typography>
        </Box>
        {tagArray.length > 1 && (
          <Box sx={{my: 4, display: 'flex', gap: '0.5rem'}}>
            {tagArray.map((tag, index) => {
              if (tag.tag !== appId) {
                return (
                  <Chip
                    component={Link}
                    to="/search"
                    state={tag.tag.replace(appId + '_', '')}
                    variant="outlined"
                    color="primary"
                    key={index}
                    label={tag.tag.replace(appId + '_', '')}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(35, 32, 32, 0.04)',
                      },
                      cursor: 'pointer',
                    }}
                  />
                );
              }
            })}
          </Box>
        )}
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justifyContent="space-around"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.088)',
            borderRadius: '1.25rem',
            padding: 1,
            my: 4,
          }}
        >
          {mediumScreen ? (
            <Grid item align="center">
              <IconButton
                sx={{m: 'auto', borderRadius: '2rem'}}
                aria-label="favoriteIcon"
                onClick={() => {
                  if (user) {
                    refreshLikes ? deleteLike() : doLike();
                  }
                }}
                variant="contained"
              >
                {refreshLikes || !user ? (
                  <FavoriteRounded
                    sx={{color: '#7047A6', fontSize: '1.75rem'}}
                  />
                ) : (
                  <FavoriteBorderRounded
                    sx={{color: '#7047A6', fontSize: '1.75rem'}}
                  />
                )}
              </IconButton>
              <Typography component="p" variant="caption">
                {likes} {likes === 1 ? 'like' : 'likes'}
              </Typography>
            </Grid>
          ) : (
            <Grid item align="center">
              <IconButton
                aria-label="favoriteIcon"
                onClick={refreshLikes ? deleteLike : doLike}
                onMouseOver={handleMouseOverLikes}
                onMouseOut={handleMouseOutLikes}
                variant="contained"
                sx={{m: 'auto', borderRadius: '2rem'}}
              >
                {refreshLikes ? (
                  showTextLikes ? (
                    <FavoriteBorderRounded
                      sx={{color: '#7047A6', fontSize: '1.75rem'}}
                    />
                  ) : (
                    <FavoriteRounded
                      sx={{color: '#7047A6', fontSize: '1.75rem'}}
                    />
                  )
                ) : showTextLikes ? (
                  <FavoriteRounded
                    sx={{color: '#7047A6', fontSize: '1.75rem'}}
                  />
                ) : (
                  <FavoriteBorderRounded
                    sx={{color: '#7047A6', fontSize: '1.75rem'}}
                  />
                )}
              </IconButton>
              <Typography component="p" variant="caption">
                {refreshLikes
                  ? showTextLikes
                    ? 'Unlike'
                    : ''
                  : showTextLikes
                  ? 'Add a like'
                  : ''}
                {!showTextLikes
                  ? `${likes} ${likes === 1 ? 'like' : 'likes'}`
                  : null}
              </Typography>
            </Grid>
          )}

          <Grid item align="center">
            {refreshRating ? (
              <>
                <IconButton
                  onClick={doDeleteRating}
                  onMouseOver={handleMouseOverRating}
                  onMouseOut={handleMouseOutRating}
                  sx={{m: 'auto', borderRadius: '2rem'}}
                >
                  <Rating
                    name="read-only"
                    size="large"
                    precision={0.2}
                    defaultValue={parseInt(rating.toFixed(1))}
                    value={parseInt(rating.toFixed(1))}
                    readOnly
                    icon={
                      <StarRounded
                        sx={{color: '#7047A6', fontSize: '1.75rem'}}
                      />
                    }
                    emptyIcon={
                      <StarBorderRounded
                        sx={{color: '#7047A6', fontSize: '1.75rem'}}
                      />
                    }
                  />
                </IconButton>
                <Typography sx={{ml: 1}} component="p" variant="caption">
                  {mediumScreen && 'Click stars to remove rating'}
                </Typography>
                <Typography sx={{ml: 1}} component="p" variant="caption">
                  {mediumScreen
                    ? `${rating.toFixed(1)} (${ratingCount} ${
                        ratingCount === 1 ? 'rating' : 'ratings'
                      })`
                    : showTextRating
                    ? 'Remove rating'
                    : `${rating.toFixed(1)} (${ratingCount} ${
                        ratingCount === 1 ? 'rating' : 'ratings'
                      })`}
                </Typography>
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => deleteRating}
                  onMouseOver={handleMouseOverRating}
                  onMouseOut={handleMouseOutRating}
                  sx={{m: 'auto', borderRadius: '2rem'}}
                >
                  <Rating
                    defaultValue={parseInt(rating.toFixed(1))}
                    name="simple-controlled"
                    size="large"
                    value={rating}
                    precision={1}
                    onChange={(event, newValue) => {
                      doRating(newValue);
                    }}
                    icon={
                      <StarRounded
                        sx={{color: '#7047A6', fontSize: '1.75rem'}}
                      />
                    }
                    emptyIcon={
                      <StarBorderRounded
                        sx={{color: '#7047A6', fontSize: '1.75rem'}}
                      />
                    }
                  />
                </IconButton>
                <Typography sx={{ml: 1}} component="p" variant="caption">
                  {mediumScreen && 'Click stars to add a rating'}
                </Typography>
                <Typography sx={{ml: 1}} component="p" variant="caption">
                  {mediumScreen
                    ? `${rating.toFixed(1)} (${ratingCount} ${
                        ratingCount === 1 ? 'rating' : 'ratings'
                      })`
                    : showTextRating
                    ? 'Add a rating'
                    : `${rating.toFixed(1)} (${ratingCount} ${
                        ratingCount === 1 ? 'rating' : 'ratings'
                      })`}
                </Typography>
              </>
            )}
            <AlertDialog
              content={'You need to be logged in to add a like.'}
              dialogOpen={likeFailedDialogOpen}
              setDialogOpen={setLikeFailedDialogOpen}
            />
            <AlertDialog
              content={'You need to be logged in to add a rating.'}
              dialogOpen={ratingFailedDialogOpen}
              setDialogOpen={setRatingFailedDialogOpen}
            />
          </Grid>
        </Grid>
        <Box sx={{my: 3}}>
          <Typography component="h2" variant="h4" sx={{mb: 3}}>
            Comments ({commentCount})
          </Typography>
          {commentCount === 0 && (
            <Typography component="p" variant="body1" sx={{mb: 3}}>
              No comments added.
            </Typography>
          )}
          {[...commentArray].reverse().map((item, index) => {
            if (index < showComments) {
              return (
                <CommentRow
                  key={item.comment_id}
                  file={item}
                  refreshData={refreshComments}
                  setRefreshData={setRefreshComments}
                />
              );
            }
          })}
          {commentCount > showComments && (
            <Button
              sx={{width: '100%', my: 1}}
              onClick={() => setShowComments(showComments + 6)}
            >
              Show more comments
            </Button>
          )}
          <ValidatorForm onSubmit={handleSubmit}>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1}
              sx={{mt: 1}}
            >
              <Grid item xs={true}>
                <TextValidator
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  name="comment"
                  placeholder="Write a comment..."
                  label="Comment"
                  onChange={handleInputChange}
                  value={inputs.comment}
                  validators={commentValidators.comment}
                  errorMessages={commentErrorMessages.comment}
                  disabled={!user}
                  helperText={!user && 'You need to login to add a comment.'}
                />
              </Grid>
              <Grid item xs="auto">
                <Button
                  variant="contained"
                  type="submit"
                  aria-label="Send comment"
                  disabled={!user}
                  sx={{
                    borderRadius: '0.75rem',
                    minWidth: '56px',
                    width: '56px',
                    py: '16px',
                  }}
                  size="large"
                >
                  <SendRounded />
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Box>
      </Container>
    </>
  );
};

Single.propTypes = {};

export default Single;
