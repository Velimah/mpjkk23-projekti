import React, {useContext} from 'react';
import {Snackbar, Alert} from '@mui/material';
import {MediaContext} from '../contexts/MediaContext';

const Toast = (props) => {
  const {snackbar, snackbarOpen, setSnackbarOpen} = useContext(MediaContext);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      sx={{bottom: {xs: 74, sm: 20}}}
    >
      <Alert
        severity={snackbar && snackbar.severity}
        onClose={handleSnackbarClose}
        sx={{
          width: '100%',
          mx: {xs: 3, sm: 0},
        }}
        elevation={6}
      >
        {snackbar && snackbar.message}
      </Alert>
    </Snackbar>
  );
};

Toast.propTypes = {};

export default Toast;
