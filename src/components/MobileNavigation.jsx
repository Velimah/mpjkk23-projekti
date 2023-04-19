import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';

const MobileNavigation = ({navUnLogged, navLogged}) => {
  const {user} = useContext(MediaContext);
  const [value, setValue] = useState(0);
  return (
    <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={4}>
      <BottomNavigation
        showLabels
        as="nav"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {user
          ? navLogged.map((link) => (
              <BottomNavigationAction
                key={link.page}
                label={link.page}
                icon={link.icon}
                component={Link}
                to={link.to}
              />
            ))
          : navUnLogged.map((link) => (
              <BottomNavigationAction
                key={link.page}
                label={link.page}
                icon={link.icon}
                component={Link}
                to={link.to}
              />
            ))}
      </BottomNavigation>
    </Paper>
  );
};

MobileNavigation.propTypes = {
  navUnLogged: PropTypes.array,
  navLogged: PropTypes.array,
};

export default MobileNavigation;
