import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {useNavigate} from 'react-router-dom';
import UpdateUserForm from '../components/UpdateUserForm';
import UploadProfilePicture from '../components/UploadProfilePicture';
import UploadProfileBackgroundPicture from '../components/UploadProfileBackgroundPicture';

const UpdateUserInfo = () => {
  const {user} = useContext(MediaContext);
  const navigate = useNavigate();

  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );

  return (
    <>
      {user && (
        <>
          <Container maxWidth="lg" sx={{p: {xs: '6rem 0', sm: '3rem 3rem'}}}>
            <Typography
              component="h1"
              variant="h1"
              textAlign="center"
              sx={{mb: 3}}
            >
              Update User info
            </Typography>
            <Paper
              sx={{
                p: {xs: 0, sm: '1rem', md: '3rem'},
                borderRadius: '1.5rem',
                bgcolor: {xs: 'transparent', sm: '#FFFFFF'},
              }}
              elevation={extraSmallScreen ? 0 : 6}
            >
              <UploadProfileBackgroundPicture />
              <Box
                display="flex"
                sx={{flexDirection: {xs: 'column', sm: 'row'}}}
              >
                <UploadProfilePicture />
                <UpdateUserForm />
              </Box>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default UpdateUserInfo;
