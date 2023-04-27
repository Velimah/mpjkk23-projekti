import {
  Card,
  CardMedia,
  Typography,
  Box,
  Grid,
  Button,
  CardContent,
  Rating,
  Avatar,
  IconButton,
} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import {mediaUrl, appId} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import {
  useFavourite,
  useUser,
  useComment,
  useMedia,
  useRating,
  useTag,
} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import CommentRow from '../components/CommentRow';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import useForm from '../hooks/FormHooks';
import {commentErrorMessages} from '../utils/errorMessages';
import {commentValidators} from '../utils/validator';
import {formatTime, formatSize} from '../utils/UnitConversions';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Star, StarBorderOutlined} from '@mui/icons-material';
import {styled} from '@mui/material/styles';

const Single = () => {
  const {user, setTargetUser} = useContext(MediaContext);

  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [commentArray, setCommentArray] = useState([]);
  const [tagArray, setTagArray] = useState([]);
  const [mediaInfo, setMediaInfo] = useState({});

  const [refreshLikes, setRefreshLikes] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  const [refreshRating, setRefreshRating] = useState(false);

  const [profilePic, setProfilePic] = useState({
    filename: 'https://placekitten.com/200/200',
  });

  const {getMediaById} = useMedia();
  const {getUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const {postComment, getCommentsById} = useComment();
  const {postRating, deleteRating, getRatingsById} = useRating();
  const {getTag, getTagsByFileId} = useTag();

  const navigate = useNavigate();
  const {state} = useLocation();

  const [data, setData] = useState(() => {
    return state?.file ?? JSON.parse(window.localStorage.getItem('targetUser'));
  });

  useEffect(() => {
    window.localStorage.setItem('targetUser', JSON.stringify(data));
  }, [setData]);

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

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const ownerInfo = await getUser(data.user_id, token);
      setOwner(ownerInfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const profilePictures = await getTag(
        appId + '_profilepicture_' + data.user_id
      );
      const profilePicture = profilePictures.pop();
      profilePicture.filename = mediaUrl + profilePicture.filename;
      setProfilePic(profilePicture);
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
      const likeInfo = await getFavourites(data.file_id);
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
    fetchUser();
    fetchProfilePicture();
    fetchMediaInfo();
    fetchLikes();
    fetchComments();
    fetchRatings();
    fetchTags();
  }, []);

  const doLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const fileId = {file_id: data.file_id};
      await postFavourite(fileId, token);
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
      await deleteFavourite(data.file_id, token);
      setRefreshLikes(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const data2 = {file_id: data.file_id, comment: inputs.comment};
      const commentInfo = await postComment(data2, token);
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
      const data2 = {file_id: data.file_id, rating: value};
      const ratingInfo = await postRating(data2, token);
      console.log(ratingInfo);
      setRefreshRating(!refreshRating);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doDeleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      const ratingInfo = await deleteRating(data.file_id, token);
      console.log(ratingInfo);
      setRefreshRating(!refreshRating);
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
    <>
      <Box sx={{maxWidth: 'md', margin: 'auto', my: 6}}>
        <Card>
          <Avatar
            src={profilePic.filename}
            sx={{width: 200, height: 200, borderRadius: '100%'}}
          />
          <Typography component="h2" variant="h2" sx={{p: 2}}>
            Username: {owner.username}
          </Typography>
          <Button
            sx={{p: 1, m: 1}}
            component={Link}
            variant="contained"
            to="/userprofiles"
            state={{data}}
            onClick={() => {
              setTargetUser(data);
            }}
          >
            View profile
          </Button>
          <Typography component="h1" variant="h2" sx={{p: 2}}>
            Title: {data.title}
          </Typography>
          <CardMedia
            controls={true}
            poster={mediaUrl + data.screenshot}
            component={componentType}
            src={mediaUrl + data.filename}
            title={data.title}
            sx={{
              filter: `brightness(${allData.filters.brightness}%)
                       contrast(${allData.filters.contrast}%)
                       saturate(${allData.filters.saturation}%)
                       sepia(${allData.filters.sepia}%)`,
              backgroundImage:
                data.media_type === 'audio' && `url('/vite.svg')`,
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
              Filesize: {formatSize(mediaInfo.filesize)} Mediatype:
              {mediaInfo.media_type} Mimetype: {mediaInfo.mime_type}
            </Typography>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              Tags:{' '}
              {tagArray.length > 0 &&
                tagArray.map((tag) => {
                  if (tag.tag !== appId) {
                    return tag.tag.replace(appId + '_', '') + ' ';
                  }
                })}
            </Typography>

            <Grid container>
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
                {refreshRating ? (
                  <IconButton onClick={doDeleteRating}>
                    <Rating
                      name="read-only"
                      size="large"
                      precision={0.2}
                      defaultValue={rating.toFixed(1)}
                      value={rating.toFixed(1)}
                      readOnly
                      icon={
                        <Star sx={{color: '#7047A6', fontSize: '1.8rem'}} />
                      }
                      emptyIcon={
                        <StarBorderOutlined
                          sx={{color: '#7047A6', fontSize: '1.8rem'}}
                        />
                      }
                    />
                    <Typography sx={{ml: 1}} component="p" variant="body1">
                      {rating.toFixed(1)} ({ratingCount}{' '}
                      {ratingCount > 1 ? 'ratings' : 'rating'})
                    </Typography>
                  </IconButton>
                ) : (
                  <IconButton>
                    <Rating
                      defaultValue={rating.toFixed(1)}
                      name="simple-controlled"
                      size="large"
                      value={rating.toFixed(1)}
                      precision={1}
                      onChange={(event, newValue) => {
                        doRating(newValue);
                      }}
                      onClick={() => deleteRating}
                      icon={
                        <Star sx={{color: '#7047A6', fontSize: '1.8rem'}} />
                      }
                      emptyIcon={
                        <StarBorderOutlined
                          sx={{color: '#7047A6', fontSize: '1.8rem'}}
                        />
                      }
                    />
                    {ratingCount ? (
                      <Typography sx={{ml: 1}} component="p" variant="body1">
                        {rating.toFixed(1)} ({ratingCount}{' '}
                        {ratingCount > 1 ? 'ratings' : 'rating'})
                      </Typography>
                    ) : (
                      <Typography sx={{ml: 1}} component="p" variant="body1">
                        No ratings yet
                      </Typography>
                    )}
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box display="flex" width="100%" justifyContent="center">
          <Button
            variant="contained"
            sx={{m: 5, width: '200px'}}
            onClick={() => navigate('/home')}
          >
            Back
          </Button>
        </Box>

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
