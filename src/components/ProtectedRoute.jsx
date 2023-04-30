import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {useUser} from '../hooks/ApiHooks';

const ProtectedRoute = ({children}) => {
  const {getUserByToken} = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getUserInfo();
      setIsAuthenticated(userData);
    };
    checkAuth();
  }, []);

  const getUserInfo = async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      return false;
    }
    const userData = await getUserByToken(userToken);
    return Boolean(userData);
  };

  if (isAuthenticated === null) {
    return null;
  } else if (isAuthenticated) {
    return children;
  } else {
    alert('Unauthorized! Purrmission denied!');
    return <Navigate to="/home" replace />;
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
