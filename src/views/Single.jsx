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
import {useFavourite, useUser} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';

const Single = () => {
  const [owner, setOwner] = useState({username: ''});
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const {user} = useContext(MediaContext);

  const {getUser} = useUser();
  const {getFavourites, postFavourite, deleteFavourite} = useFavourite();

  const navigate = useNavigate();
  const {state} = useLocation();
  const file = state.file;
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
      console.log(likeInfo);
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

  useEffect(() => {
    fetchUser();
    fetchLikes();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  return (
    <>
      <Box sx={{maxWidth: 'lg', margin: 'auto', mt: 10}}>
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
              // height: file.media_type === 'audio' && 600,
              // width: file.media_type === 'audio' && 600,
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
            <Button
              onClick={doLike}
              disabled={userLike}
              variant="contained"
              sx={{mt: 5, mr: 2}}
            >
              Like
            </Button>
            <Button
              onClick={deleteLike}
              disabled={!userLike}
              variant="contained"
              sx={{mt: 5}}
            >
              Dislike
            </Button>
            <Typography
              display={'inline'}
              component="h2"
              variant="h6"
              sx={{mt: 5}}
            >
              Likes: {likes}
            </Typography>
          </CardContent>
        </Card>
        <Grid container justifyContent="center">
          <Grid item xs={6} sx={{mb: 5}}>
            <Button
              variant="contained"
              fullWidth
              sx={{mt: 5}}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

// TODO in the next task: add propType for location

export default Single;
