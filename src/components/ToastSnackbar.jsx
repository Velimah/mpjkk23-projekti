import React, {useContext} from 'react';
import {Snackbar, Alert} from '@mui/material';
import {MediaContext} from '../contexts/MediaContext';

const ToastSnackbar = (props) => {
  const {toastSnackbar, toastSnackbarOpen, setToastSnackbarOpen} =
    useContext(MediaContext);

  const handleSnackbarClose = () => {
    setToastSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={toastSnackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      sx={{bottom: {xs: 74, sm: 20}}}
    >
      <Alert
        severity={toastSnackbar && toastSnackbar.severity}
        onClose={handleSnackbarClose}
        sx={{
          width: '100%',
          mx: {xs: 3, sm: 0},
        }}
        elevation={6}
      >
        {toastSnackbar && toastSnackbar.message}
      </Alert>
    </Snackbar>
  );
};

ToastSnackbar.propTypes = {};

export default ToastSnackbar;
