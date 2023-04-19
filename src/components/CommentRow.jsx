import { Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTag, useUser } from '../hooks/ApiHooks';
import { appId, mediaUrl } from '../utils/variables';

const CommentRow = ({file}) => {
  // console.log(file);

  const {getUser} = useUser();
  const {getTag} = useTag();
  const [profilePic, SetProfilePic] = useState({
    filename: 'https://placekitten.com/50/50',
  });
  const [userInfo, SetUserInfo] = useState('');


  const fetchProfilePicture = async () => {
    try {
        const profilePictures = await getTag(appId + '_profilepicture_' + file.user_id);
        const profilePicture = profilePictures.pop();
        profilePicture.filename = mediaUrl + profilePicture.filename;
        SetProfilePic(profilePicture);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchUserInfo = async () => {
    try {
        const token = localStorage.getItem('token');
        const userInfo = await getUser(file.user_id, token);
        SetUserInfo(userInfo);
    } catch (error) {
      console.error(error.message);
    }
  };

  useState(() => {
    fetchProfilePicture();
    fetchUserInfo();
  }, []);

  return (
    <>
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
      <div>user_name: {userInfo.username}</div>
      <div>time added: {file.time_added}</div>
      <div>comment: {file.comment}</div>
      <div>user_id: {file.user_id}</div>
      <div>comment_id: {file.comment_id}</div>
    </>
  );
};

CommentRow.propTypes = {
  file: PropTypes.object.isRequired,
};

export default CommentRow;