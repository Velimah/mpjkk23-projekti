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
      try {
        const userData = await getUserInfo();
        setIsAuthenticated(userData);
        setLoaded(true);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [children]);

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      return false;
    }
    try {
      const userData = await getUserByToken(userToken);
      return Boolean(userData);
    } catch (error) {
      console.error(error.message);
      setLoaded(true);
      return false;
    }
  };

  if (loaded) {
    if (isAuthenticated) {
      return children;
    } else {
      console.log('Unauthorized! Permission denied!');
      localStorage.clear();
      return <Navigate to="/" replace />;
    }
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
