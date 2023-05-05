import {useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';

const Logout = () => {
  const {
    setUser,
    setToastSnackbar,
    setToastSnackbarOpen,
    unauthorizedUser,
    setUnauthorizedUser,
  } = useContext(MediaContext);

  useEffect(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('targetUser');
    if (unauthorizedUser) {
      setToastSnackbar({
        severity: 'error',
        message: 'Unauthorized! Permission denied!',
      });
    } else {
      setToastSnackbar({
        severity: 'success',
        message: 'Logged out successfully',
      });
    }
    setToastSnackbarOpen(true);
  }, []);

  if (unauthorizedUser) {
    setUnauthorizedUser(false);
    return <Navigate to="/login" />;
  } else {
    setUnauthorizedUser(false);
    return <Navigate to="/" />;
  }
};

export default Logout;
