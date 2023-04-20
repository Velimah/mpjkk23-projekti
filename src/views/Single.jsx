import {
  Card,
  CardMedia,
  Typography,
  Box,
  Grid,
  Button,
  CardContent,
  Rating,
} from '@mui/material';
import {useLocation} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import {
  useFavourite,
  useUser,
  useComment,
  useMedia,
  useRating,
} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import CommentRow from '../components/CommentRow';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import useForm from '../hooks/FormHooks';
import {commentErrorMessages} from '../utils/errorMessages';
import {commentValidators} from '../utils/validator';
import {formatTime, formatSize} from '../hooks/UnitHooks';

const Single = () => {
  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [commentArray, setCommentArray] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [mediaInfo, setMediaInfo] = useState({});

  const [refreshLikes, setRefreshLikes] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  const [refreshRating, setRefreshRating] = useState(false);

  const {user} = useContext(MediaContext);
  const {getMediaById} = useMedia();
  const {getUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const {postComment, getCommentsById} = useComment();
  const {postRating, deleteRating, getRatingsById} = useRating();

  const navigate = useNavigate();
  const {state} = useLocation();

  const [data, setData] = useState(() => {
    return (
      state?.file || JSON.parse(window.localStorage.getItem('details')) || {}
    );
  });

  useEffect(() => {
    window.localStorage.setItem('details', JSON.stringify(data));
  }, [data]);

  const file = data;
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

  let componentType = 'img';
  switch (file.media_type) {
    case 'video':
      componentType = 'video';
      break;
    case 'audio':
      componentType = 'audio';
      break;
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

  const fetchMediaInfo = async () => {
    try {
      const mediaInfo = await getMediaById(data.file_id);
      setMediaInfo(mediaInfo);
    } catch (error) {
      console.log(error.message);
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

  const fetchComments = async () => {
    try {
      const commentInfo = await getCommentsById(file.file_id);
      setCommentCount(commentInfo.length);
      return setCommentArray(commentInfo);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMediaInfo();
    fetchLikes();
    fetchComments();
    fetchRatings();
  }, []);

  const doLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {file_id: file.file_id};
      const likeInfo = await postFavourite(data, token);
      console.log(likeInfo);
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
      console.log(likeInfo);
      setRefreshLikes(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {file_id: file.file_id, comment: inputs.comment};
      const commentInfo = await postComment(data, token);
      alert(commentInfo.message);
      setRefreshComments(!refreshComments);
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
      console.log(ratingInfo);
      let sum = 0;
      setRatingCount(ratingInfo.length);

      ratingInfo.forEach((rating) => {
        sum += rating.rating;
        if (rating.user_id === user.user_id) {
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
    <>
      <Box sx={{maxWidth: 'lg', margin: 'auto', my: 6}}>
        <Card>
          <Typography component="h1" variant="h2" sx={{p: 2}}>
            {file.title}
          </Typography>
          <CardMedia
            controls={true}
            poster={mediaUrl + file.screenshot}
            component={componentType}
            src={mediaUrl + file.filename}
            title={file.title}
            style={{
              filter: `brightness(${allData.filters.brightness}%)
                       contrast(${allData.filters.contrast}%)
                       saturate(${allData.filters.saturation}%)
                       sepia(${allData.filters.sepia}%)`,
              backgroundImage:
                file.media_type === 'audio' && `url('/vite.svg')`,
            }}
          />
          <CardContent>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              Description: {allData.desc}
            </Typography>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              Time added: {formatTime(mediaInfo.time_added)}
            </Typography>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              filesize: {formatSize(mediaInfo.filesize)} Mediatype:{' '}
              {mediaInfo.media_type} mimetype: {mediaInfo.mime_type}
            </Typography>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              User: {owner.username}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography component="h2" variant="h6">
                  Likes: {likes}
                </Typography>
                <Button
                  onClick={refreshLikes ? deleteLike : doLike}
                  variant="contained"
                  sx={
                    refreshLikes
                      ? {
                          mt: 1,
                        }
                      : {
                          mt: 1,
                          backgroundColor: 'grey',
                          '&:hover': {
                            backgroundColor: 'grey !important',
                          },
                        }
                  }
                >
                  {refreshLikes ? 'Liked' : 'Like'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                {refreshRating ? (
                  <Box sx={{mt: 1}}>
                    <Rating
                      name="read-only"
                      precision={0.1}
                      defaultValue={rating}
                      value={rating}
                      readOnly
                    />
                    <Typography component="legend">Rated already!</Typography>
                    <Typography component="legend">
                      {rating} ({ratingCount} ratings)
                    </Typography>
                    <Button onClick={doDeleteRating} variant="contained">
                      delete rating
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{mt: 1}}>
                    <Rating
                      defaultValue={rating}
                      name="simple-controlled"
                      value={rating}
                      precision={0.1}
                      onChange={(event, newValue) => {
                        doRating(newValue);
                      }}
                    />
                    <Typography component="legend">Add rating</Typography>
                    <Typography component="legend">
                      {rating} ({ratingCount} ratings)
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid container justifyContent="center">
          <Grid item xs={4} sx={{mb: 5}}>
            <Button
              variant="contained"
              fullWidth
              sx={{mt: 5}}
              onClick={() => navigate('/home')}
            >
              Back
            </Button>
          </Grid>
        </Grid>

        <ValidatorForm onSubmit={handleSubmit}>
          <TextValidator
            fullWidth
            margin="dense"
            name="comment"
            placeholder="Comment"
            onChange={handleInputChange}
            value={inputs.comment}
            validators={commentValidators.comment}
            errorMessages={commentErrorMessages.comment}
          />
          <Button variant="contained" sx={{my: 2}} type="submit">
            Comment
          </Button>
        </ValidatorForm>
        <Typography>Comments ({commentCount})</Typography>

        <div>
          {commentArray
            .map((item, index) => {
              return (
                <CommentRow
                  key={index}
                  file={item}
                  fetchComments={fetchComments}
                />
              );
            })
            .reverse()}
        </div>
      </Box>
    </>
  );
};

Single.propTypes = {};

export default Single;
