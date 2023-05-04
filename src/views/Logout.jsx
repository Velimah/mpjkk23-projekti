import {useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';

const Logout = () => {
  const {setUser, setToastSnackbar, setToastSnackbarOpen, unauthorizedUser} =
    useContext(MediaContext);

  useEffect(() => {
    setUser(null);
    localStorage.clear();
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
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/" />;
  }
};

export default Logout;
