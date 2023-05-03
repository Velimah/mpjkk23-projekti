import React, {useContext, useEffect, useState} from 'react';
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
  ModeEditRounded,
  MoreVertRounded,
} from '@mui/icons-material';
import {MediaContext} from '../contexts/MediaContext';
import {useComment, useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {appId, mediaUrl, profilePlaceholder} from '../utils/variables';
import {formatTime} from '../utils/UnitConversions';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import AlertDialog from './AlertDialog';

const UserHeader = ({
  file,
  comment = false,
  postSettings = false,
  refreshData = false,
  setRefreshData = null,
}) => {
  const {
    user,
    setTargetUser,
    setToastSnackbar,
    setToastSnackbarOpen,
    refreshPage,
    setRefreshPage,
  } = useContext(MediaContext);
  const {getUser} = useUser();
  const {getTag} = useTag();
  const {deleteComment} = useComment();
  const {deleteMedia} = useMedia();

  const navigate = useNavigate();
  const location = useLocation();

  const [userInfo, setUserInfo] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [profilePic, setProfilePic] = useState({
    filename: profilePlaceholder,
  });

  const postSettingsOpen = Boolean(anchorEl);

  const doDeleteFile = async () => {
    setDeleteFileDialogOpen(false);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const deleteResult = await deleteMedia(file.file_id, token);
        setToastSnackbar({severity: 'success', message: deleteResult.message});
        setToastSnackbarOpen(true);
        setRefreshPage(!refreshPage);
        if (location.pathname === '/single') navigate('/');
      }
    } catch (error) {
      setToastSnackbar({
        severity: 'error',
        message: 'Something went wrong - Please try again later',
      });
      setToastSnackbarOpen(true);
      console.error(error);
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

  useEffect(() => {
    fetchProfilePicture();
    fetchUserInfo();
  }, [refreshData]);

  useState(() => {
    fetchProfilePicture();
    fetchUserInfo();
  }, []);

  const doDeleteComment = async () => {
    setDeleteCommentDialogOpen(false);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const commentInfo = await deleteComment(file.comment_id, token);
        setToastSnackbar({severity: 'success', message: commentInfo.message});
        setToastSnackbarOpen(true);
        setRefreshData(!refreshData);
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
      justifyContent="space-between"
      sx={{mb: 2}}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          component={Link}
          to={
            user && file.user_id === user.user_id ? '/profile' : '/userprofiles'
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
            sx={{width: 45, height: 45, boxShadow: 3, mr: '0.75rem'}}
          />
          {user && (
            <Typography component="span" variant="h6" sx={{mr: '1rem'}}>
              {userInfo.username}
            </Typography>
          )}
          <Chip
            label={formatTime(file.time_added)}
            size="small"
            sx={{py: '0.9rem', px: '0.3rem'}}
          />
        </Stack>
      </Stack>
      {comment && user && file.user_id === user.user_id && (
        <>
          <Tooltip title="Delete comment">
            <IconButton
              component={Link}
              sx={{
                borderRadius: '2rem',
                '&:hover': {
                  color: '#B00020',
                },
              }}
              onClick={() => {
                setDeleteCommentDialogOpen(true);
              }}
            >
              <DeleteRounded />
            </IconButton>
          </Tooltip>
          <AlertDialog
            title={'Are you sure you want to delete this comment?'}
            content={'If you delete this comment it will be lost permanently.'}
            functionToDo={doDeleteComment}
            dialogOpen={deleteCommentDialogOpen}
            setDialogOpen={setDeleteCommentDialogOpen}
          />
        </>
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
              sx={{
                borderRadius: '2rem',
                '&:hover': {
                  color: '#7047A6',
                },
              }}
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
            <MenuItem
              component={Link}
              to="/modify"
              state={{file}}
              sx={{
                '&:hover': {
                  color: '#7047A6',
                },
              }}
            >
              <ListItemIcon>
                <ModeEditRounded fontSize="small" />
              </ListItemIcon>
              Modify post
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteFileDialogOpen(true);
                handleMenuClose();
              }}
              sx={{
                '&:hover': {
                  color: '#7047A6',
                },
              }}
            >
              <ListItemIcon>
                <DeleteRounded fontSize="small" />
              </ListItemIcon>
              Delete post
            </MenuItem>
          </Menu>
          <AlertDialog
            title={'Are you sure you want to delete this post?'}
            content={'If you delete this post it will be lost permanently.'}
            functionToDo={doDeleteFile}
            dialogOpen={deleteFileDialogOpen}
            setDialogOpen={setDeleteFileDialogOpen}
          />
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
