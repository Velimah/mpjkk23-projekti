import {useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';

const Logout = () => {
  const {setUser} = useContext(MediaContext);
  useEffect(() => {
    setUser(null);
    localStorage.clear();
  }, []);
  return <Navigate to="/" />;
};

export default Logout;
