import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Paper,
} from '@mui/material';
import {AddCircleOutlineRounded} from '@mui/icons-material';

const MobileNavigation = ({navUnLogged, navLogged}) => {
  const {user} = useContext(MediaContext);
  const [value, setValue] = useState(0);
  return (
    <>
      {user && (
        <Fab
          color="secondary"
          variant="extended"
          component={Link}
          to="/upload"
          style={{
            margin: 0,
            top: 'auto',
            right: '1rem',
            bottom: 72,
            left: 'auto',
            position: 'fixed',
          }}
        >
          <AddCircleOutlineRounded sx={{mr: 1}} />
          Upload
        </Fab>
      )}
      <Paper
        sx={{position: 'fixed', bottom: 0, left: 0, right: 0}}
        elevation={4}
      >
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
                  selected
                />
              ))
            : navUnLogged.map((link) => (
                <BottomNavigationAction
                  key={link.page}
                  label={link.page}
                  icon={link.icon}
                  component={Link}
                  to={link.to}
                  selected
                />
              ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};

MobileNavigation.propTypes = {
  navUnLogged: PropTypes.array,
  navLogged: PropTypes.array,
};

export default MobileNavigation;
