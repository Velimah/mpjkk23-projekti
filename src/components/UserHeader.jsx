import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DeleteRounded,
  FiberManualRecord,
  ModeEditRounded,
  MoreVertRounded,
} from '@mui/icons-material';
import {MediaContext} from '../contexts/MediaContext';
import {useComment, useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {appId, mediaUrl, profilePlaceholder} from '../utils/variables';
import {formatTime} from '../utils/UnitConversions';
import {Link, useNavigate} from 'react-router-dom';

const UserHeader = ({
  file,
  comment = false,
  postSettings = false,
  refreshData = false,
  setRefreshData = null,
}) => {
  const {user, setTargetUser} = useContext(MediaContext);
  const {getUser} = useUser();
  const {getTag} = useTag();
  const {deleteComment} = useComment();
  const {deleteMedia} = useMedia();
  const [profilePic, setProfilePic] = useState({
    filename: profilePlaceholder,
  });
  const [userInfo, setUserInfo] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const postSettingsOpen = Boolean(anchorEl);

  const navigate = useNavigate();

  const doDeleteFile = async () => {
    try {
      const sure = confirm('Are you sure you want to delete this file?');
      if (sure) {
        const token = localStorage.getItem('token');
        if (token) {
          const deleteResult = await deleteMedia(file.file_id, token);
          console.log(deleteResult);
          navigate('/home');
        }
      }
    } catch (error) {
      console.log(error);
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
      console.error(error.message);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userInfo = await getUser(file.user_id, token);
        setUserInfo(userInfo);
      }
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
        if (token) {
          const commentInfo = await deleteComment(file.comment_id, token);
          alert(commentInfo.message);
          setRefreshData(!refreshData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={user ? 'space-between' : 'flex-end'}
      sx={user && {mb: 2}}
    >
      {user ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            component={Link}
            to={
              user && file.user_id === user.user_id
                ? '/profile'
                : '/userprofiles'
            }
            state={{file}}
            onClick={() => {
              setTargetUser(file);
            }}
            aria-label="Link to user's profile"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Avatar
              src={profilePic.filename}
              alt="User's profile picture"
              sx={{width: 45, height: 45, boxShadow: 3}}
            />
            <Typography component="span" variant="h6">
              {userInfo.username}
            </Typography>
          </Stack>
          <FiberManualRecord
            sx={{
              fontSize: '0.25rem',
            }}
          />
          <Chip label={formatTime(file.time_added)} size="small" />
        </Stack>
      ) : (
        <Chip label={formatTime(file.time_added)} size="small" />
      )}
      {comment && user && file.user_id === user.user_id && (
        <Tooltip title="Delete comment">
          <IconButton component={Link} onClick={doDeleteComment}>
            <DeleteRounded />
          </IconButton>
        </Tooltip>
      )}
      {postSettings && user && file.user_id === user.user_id && (
        <>
          <Tooltip title="Post settings">
            <IconButton
              onClick={handleSettingsClick}
              aria-label="Post settings"
              aria-controls={postSettingsOpen ? 'post-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={postSettingsOpen ? 'true' : undefined}
            >
              <MoreVertRounded />
            </IconButton>
          </Tooltip>
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={postSettingsOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem component={Link} to="/modify" state={{file}}>
              <ListItemIcon>
                <ModeEditRounded fontSize="small" />
              </ListItemIcon>
              Modify post
            </MenuItem>
            <MenuItem onClick={doDeleteFile}>
              <ListItemIcon>
                <DeleteRounded fontSize="small" />
              </ListItemIcon>
              Delete post
            </MenuItem>
          </Menu>
        </>
      )}
    </Stack>
  );
};

UserHeader.propTypes = {
  file: PropTypes.object.isRequired,
  comment: PropTypes.bool,
  postSettings: PropTypes.bool,
  refreshData: PropTypes.bool,
  setRefreshData: PropTypes.func,
};

export default UserHeader;
