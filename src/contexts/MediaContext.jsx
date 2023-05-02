import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext();

const MediaProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(null);

  return (
    <MediaContext.Provider
      value={{
        user,
        setUser,
        targetUser,
        setTargetUser,
        snackbar,
        setSnackbar,
        snackbarOpen,
        setSnackbarOpen,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export {MediaContext, MediaProvider};
