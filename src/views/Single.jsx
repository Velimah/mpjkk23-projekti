import {
  Card,
  CardMedia,
  Typography,
  Box,
  Grid,
  Button,
  CardContent,
} from '@mui/material';
import {useLocation} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {useNavigate} from 'react-router-dom';
import {useFavourite, useUser, useComment} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import CommentRow from '../components/CommentRow';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import useForm from '../hooks/FormHooks';
import {commentErrorMessages} from '../utils/errorMessages';
import {commentValidators} from '../utils/validator';
import PropTypes from 'prop-types';

const Single = ({myFilesOnly = false}) => {
  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const {user} = useContext(MediaContext);

  const [commentArray, setCommentArray] = useState([]);

  const {getUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();
  const {postComment, getCommentsById} = useComment(myFilesOnly);

  const navigate = useNavigate();
  const {state} = useLocation();

  const [data, setData] = useState(() => {
    return state?.file || JSON.parse(window.localStorage.getItem("details")) || {};
  });
  
  useEffect(() => {
    window.localStorage.setItem("details", JSON.stringify(data));
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
      console.log(likeInfo);
      setUserLike(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const likeInfo = await deleteFavourite(file.file_id, token);
      console.log(likeInfo);
      setUserLike(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const commentInfo = await getCommentsById(file.file_id);
      return setCommentArray(commentInfo);
    } catch (error) {
      console.log(error.message);
    }
  };

  const doComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {file_id: file.file_id, comment: inputs.comment};
      const commentInfo = await postComment(data, token);
      console.log('commentinfo', commentInfo);
      navigate(0);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLikes();
    fetchComments();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  const initValues = {
    comment: '',
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doComment,
    initValues
  );

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
              {allData.desc}
            </Typography>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              Brightness:{allData.filters.brightness + ' '}
              Contrast:{allData.filters.contrast + ' '}
              Saturation:{allData.filters.saturation + ' '}
              Sepia:{allData.filters.sepia}
            </Typography>
            <Typography component="h2" variant="h6" sx={{p: 2}}>
              User: {owner.username}
            </Typography>
            <Typography component="h2" variant="h6" sx={{mt: 5}}>
              Likes: {likes}
            </Typography>
            <Button
              onClick={doLike}
              disabled={userLike}
              variant="contained"
              sx={{mt: 1, mr: 2}}
            >
              Like
            </Button>
            <Button
              onClick={deleteLike}
              disabled={!userLike}
              variant="contained"
              sx={{
                mt: 1,
                mr: 2,
                backgroundColor: 'red',
                '&:hover': {
                  backgroundColor: 'red !important',
                },
              }}
            >
              Dislike
            </Button>
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
         <Button
              variant="contained"
              sx={{my: 2}}
              type="submit"
              >
              Comment
          </Button>
        </ValidatorForm>

        <div>{commentArray.map((item, index) => {
          return <CommentRow key={index} file={item} />;
        }).reverse()}</div>
      </Box>
    </>
  );
};

Single.propTypes = {
  myFilesOnly: PropTypes.bool,
};

export default Single;
