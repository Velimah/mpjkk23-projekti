import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';

const {getUserByToken} = useUser();

const ProtectedRoute = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const {setUnauthorizedUser} = useContext(MediaContext);

  // runs when a protected route is loaded, checks if user is authenticated and sets state to run Auth check
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

  // checks for token and then fetches user data and returns true if token is valid
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

  // when user status is checked, returns children if user is authenticated, otherwise redirects to logout
  if (loaded) {
    if (isAuthenticated) {
      return children;
    } else {
      setUnauthorizedUser(true);
      return <Navigate to="/logout" replace />;
    }
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
