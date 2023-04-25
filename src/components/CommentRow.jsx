import {Avatar, Box, Typography, Button} from '@mui/material';
import PropTypes from 'prop-types';
import {useContext, useState, useEffect} from 'react';
import {useComment, useTag, useUser} from '../hooks/ApiHooks';
import {appId, mediaUrl} from '../utils/variables';
import {Link} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {formatTime} from '../utils/UnitConversions';

const CommentRow = ({file, fetchComments}) => {
  const {user} = useContext(MediaContext);
  const {getUser} = useUser();
  const {getTag} = useTag();
  const {deleteComment} = useComment();
  const [profilePic, setProfilePic] = useState({
    filename: 'https://placekitten.com/50/50',
  });
  const [userInfo, setUserInfo] = useState('');
  const [refreshData, setRefreshData] = useState(false);

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

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const userInfo = await getUser(file.user_id, token);
      setUserInfo(userInfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  useState(() => {
    fetchProfilePicture();
    fetchUserInfo();
  }, []);

  const doDeleteComment = async () => {
    const sure = confirm('Are you sure?');
    if (sure) {
      try {
        const token = localStorage.getItem('token');
        const commentInfo = await deleteComment(file.comment_id, token);
        alert(commentInfo.message);
        setRefreshData(!refreshData);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [refreshData]);

  return (
    <>
      <Box
        sx={{
          maxWidth: 'lg',
          margin: 'auto',
          p: 2,
          my: 2,
          borderWidth: '1px',
          borderColor: 'black',
          borderStyle: 'solid',
        }}
      >
        <Avatar
          src={profilePic.filename}
          alt="Logo"
          sx={{
            borderRadius: 0,
            boxShadow: 3,
            width: 50,
            height: 50,
          }}
        />
        <Typography sx={{mb: 2}}>user_name: {userInfo.username}</Typography>
        <Button
          sx={{p: 1, m: 1}}
          component={Link}
          variant="contained"
          to="/userprofiles"
          state={{file}}
        >
          View profile
        </Button>
        <Typography sx={{mb: 1}}>
          time added: {formatTime(file.time_added)}
        </Typography>
        <Typography sx={{mb: 1}}>comment: {file.comment}</Typography>
        <Typography sx={{mb: 1}}>user_id: {file.user_id}</Typography>
        <Typography sx={{mb: 1}}>comment_id: {file.comment_id}</Typography>
        {file.user_id === user.user_id && (
          <Button
            sx={{
              p: 1,
              m: 1,
              backgroundColor: 'red',
              '&:hover': {
                backgroundColor: '#C41E3A !important',
              },
            }}
            component={Link}
            variant="contained"
            onClick={doDeleteComment}
          >
            Delete
          </Button>
        )}
      </Box>
    </>
  );
};

CommentRow.propTypes = {
  file: PropTypes.object.isRequired,
  fetchComments: PropTypes.func.isRequired,
};

export default CommentRow;
