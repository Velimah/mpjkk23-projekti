import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MediaContext = React.createContext();

const MediaProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [toastSnackbar, setToastSnackbar] = useState(null);
  const [toastSnackbarOpen, setToastSnackbarOpen] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);
  const [unauthorizedUser, setUnauthorizedUser] = useState(false);

  return (
    <MediaContext.Provider
      value={{
        user,
        setUser,
        targetUser,
        setTargetUser,
        toastSnackbar,
        setToastSnackbar,
        toastSnackbarOpen,
        setToastSnackbarOpen,
        refreshPage,
        setRefreshPage,
        unauthorizedUser,
        setUnauthorizedUser,
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
