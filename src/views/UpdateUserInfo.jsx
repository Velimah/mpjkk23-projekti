import {
  Box,
  Container,
  Typography,
  Paper,
  useMediaQuery,
  Button,
} from '@mui/material';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import UpdateUserForm from '../components/UpdateUserForm';
import UploadProfilePicture from '../components/UploadProfilePicture';
import UploadProfileBackgroundPicture from '../components/UploadProfileBackgroundPicture';
import {useNavigate} from 'react-router-dom';

const UpdateUserInfo = () => {
  const {user} = useContext(MediaContext);

  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down('sm')
  );
  const navigate = useNavigate();

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
              Update your profile
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
            <Box display="flex" width="100%" justifyContent="center">
              <Button
                variant="contained"
                sx={{mt: 4, mb: {xs: 9, sm: 0}, width: '200px'}}
                onClick={() => navigate('/profile')}
              >
                Back
              </Button>
            </Box>
          </Container>
        </>
      )}
    </>
  );
};

export default UpdateUserInfo;
