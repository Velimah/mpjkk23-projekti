import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';

const {getUserByToken} = useUser();

const ProtectedRoute = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserInfo();
      console.log('userData', userData);
      setIsAuthenticated(userData);
      setLoaded(true);
    };
    fetchData();
  }, []);

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      return false;
    }
    try {
      const userData = await getUserByToken(userToken);
      return Boolean(userData);
    } catch (e) {
      localStorage.clear();
      return false;
    }
  };
  if (loaded) {
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated === null) {
      console.log('Unauthorized! Permission denied!');
      return null;
    } else if (!isAuthenticated) {
      console.log('Unauthorized! Permission denied!');
      localStorage.clear();
      return <Navigate to="/" replace />;
    } else {
      return children;
    }
  } else {
    return null;
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
