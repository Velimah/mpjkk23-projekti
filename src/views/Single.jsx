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
  Tooltip,
} from '@mui/material';
import {Link, useLocation, useNavigate} from 'react-router-dom';
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
  ChevronLeftRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  SendRounded,
  StarBorderRounded,
  StarRounded,
} from '@mui/icons-material';
import UserHeader from '../components/UserHeader';

const Single = () => {
  const {user} = useContext(MediaContext);

  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [commentArray, setCommentArray] = useState([]);
  const [tagArray, setTagArray] = useState([]);
  const [showComments, setShowComments] = useState(3);

  const [refreshLikes, setRefreshLikes] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  const [refreshRating, setRefreshRating] = useState(false);

  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );

  const navigate = useNavigate();

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
    console.log(allData);
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
      console.log(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const commentInfo = await getCommentsById(data.file_id);
      setCommentCount(commentInfo.length);
      return setCommentArray(commentInfo);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchTags = async () => {
    try {
      const tagInfo = await getTagsByFileId(data.file_id);
      setTagArray(tagInfo);
    } catch (error) {
      console.log(error.message);
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
      } else {
        alert('You need to login to add like.');
      }
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
      if (token) {
        await deleteFavourite(data.file_id, token);
        setRefreshLikes(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const doComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const data2 = {file_id: data.file_id, comment: inputs.comment};
        const commentInfo = await postComment(data2, token);
        alert(commentInfo.message);
        setRefreshComments(!refreshComments);
      }
    } catch (error) {
      console.log(error.message);
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
      } else {
        alert('You need to login to add rating.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const doDeleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const ratingInfo = await deleteRating(data.file_id, token);
        console.log(ratingInfo);
        setRefreshRating(!refreshRating);
      }
    } catch (error) {
      console.log(error.message);
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
      const averageRating = sum / ratingInfo.length;
      setRating(averageRating);
    } catch (error) {
      console.log(error.message);
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
      <Container maxWidth="sm" sx={{mt: {xs: 8, sm: 3}, px: {xs: 4, sm: 0}}}>
        {user ? (
          <>
            <Button
              startIcon={<ChevronLeftRounded />}
              size="small"
              component={Link}
              onClick={() => navigate(-1)}
              sx={{mb: 2}}
            >
              Go back
            </Button>
            <UserHeader file={data} postSettings={true} />
          </>
        ) : (
          <Grid container alignItems="center" sx={{my: 1}}>
            <Grid item xs={8}>
              <Button
                startIcon={<ChevronLeftRounded />}
                size="small"
                component={Link}
                onClick={() => navigate(-1)}
              >
                Go back
              </Button>
            </Grid>
            <Grid item xs={true}>
              <UserHeader file={data} postSettings={true} />
            </Grid>
          </Grid>
        )}
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
      <Container maxWidth="sm" sx={{mb: {xs: 10, sm: 2}, px: {xs: 4, sm: 0}}}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid container direction="column" xs={5} alignItems="center">
            <Tooltip title={refreshLikes ? 'Remove like' : 'Add like'}>
              <IconButton
                aria-label="favoriteIcon"
                onClick={refreshLikes ? deleteLike : doLike}
                onMouseOver={handleMouseOverLikes}
                onMouseOut={handleMouseOutLikes}
                variant="contained"
                sx={{m: 'auto'}}
              >
                {refreshLikes ? (
                  <FavoriteRounded sx={{color: '#7047A6', fontSize: '2rem'}} />
                ) : (
                  <FavoriteBorderRounded
                    sx={{color: '#7047A6', fontSize: '2rem'}}
                  />
                )}
              </IconButton>
            </Tooltip>
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
          <Grid container direction="column" xs={7} alignItems="center">
            {refreshRating ? (
              <>
                <Tooltip title="Remove rating">
                  <IconButton
                    onClick={doDeleteRating}
                    onMouseOver={handleMouseOverRating}
                    onMouseOut={handleMouseOutRating}
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
                          sx={{color: '#7047A6', fontSize: '2rem'}}
                        />
                      }
                      emptyIcon={
                        <StarBorderRounded
                          sx={{color: '#7047A6', fontSize: '2rem'}}
                        />
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Typography sx={{ml: 1}} component="p" variant="caption">
                  {showTextRating
                    ? 'Remove rating'
                    : `${rating.toFixed(1)} (${ratingCount} ${
                        ratingCount === 1 ? 'rating' : 'ratings'
                      })`}
                </Typography>
              </>
            ) : (
              <>
                <Tooltip title="Add rating">
                  <IconButton
                    onClick={() => deleteRating}
                    onMouseOver={handleMouseOverRating}
                    onMouseOut={handleMouseOutRating}
                  >
                    <Rating
                      defaultValue={parseInt(rating.toFixed(1))}
                      name="simple-controlled"
                      size="large"
                      value={parseInt(rating.toFixed(1))}
                      precision={1}
                      onChange={(event, newValue) => {
                        doRating(newValue);
                      }}
                      icon={
                        <StarRounded
                          sx={{color: '#7047A6', fontSize: '2rem'}}
                        />
                      }
                      emptyIcon={
                        <StarBorderRounded
                          sx={{color: '#7047A6', fontSize: '2rem'}}
                        />
                      }
                    />
                  </IconButton>
                </Tooltip>
                {ratingCount ? (
                  <Typography sx={{ml: 1}} component="p" variant="caption">
                    {rating.toFixed(1)} ({ratingCount}
                    {ratingCount > 1 ? ' ratings' : ' rating'})
                  </Typography>
                ) : (
                  <Typography sx={{ml: 1}} component="p" variant="caption">
                    No ratings yet
                  </Typography>
                )}
              </>
            )}
          </Grid>
        </Grid>
        <Box sx={{my: 3}}>
          <Typography component="p" variant="body1">
            {allData.desc}
          </Typography>
        </Box>
        {/* TODO: Link to search page */}
        {tagArray.length > 1 && (
          <Box sx={{my: 3}}>
            {tagArray.map((tag, index) => {
              if (tag.tag !== appId) {
                return (
                  <Chip
                    variant="outlined"
                    color="primary"
                    key={index}
                    label={tag.tag.replace(appId + '_', '') + ' '}
                    sx={{mr: 1, mt: 1}}
                  />
                );
              }
            })}
          </Box>
        )}
        <Box sx={{my: 3}}>
          <Typography component="h2" variant="h4" sx={{mb: 3}}>
            Comments ({commentCount})
          </Typography>
          {commentCount === 0 && (
            <Typography component="p" variant="body1" sx={{mb: 3}}>
              No comments added.
            </Typography>
          )}
          {commentArray
            .map((item, index) => {
              if (index < showComments) {
                return (
                  <CommentRow
                    key={index}
                    file={item}
                    fetchComments={fetchComments}
                  />
                );
              }
            })
            .reverse()}
          {commentCount > showComments && (
            <Button
              sx={{width: '100%', my: 1}}
              onClick={() => setShowComments(showComments + 3)}
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
                  name="comment"
                  placeholder="Write a comment..."
                  label="Comment"
                  onChange={handleInputChange}
                  value={inputs.comment}
                  validators={commentValidators.comment}
                  errorMessages={commentErrorMessages.comment}
                  disabled={!user}
                  helperText={!user && 'You need to login to add comment.'}
                  size="small"
                />
              </Grid>
              <Grid item xs="auto">
                <Button
                  variant="contained"
                  type="submit"
                  aria-label="Send comment"
                  disabled={!user}
                  sx={{borderRadius: '4px', minWidth: '40px', width: '40px'}}
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
