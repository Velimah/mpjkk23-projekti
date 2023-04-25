import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext();

const MediaProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [update, setUpdate] = useState(true);
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <MediaContext.Provider
      value={{user, setUser, targetUser, setTargetUser, update, setUpdate}}
    >
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export {MediaContext, MediaProvider};
