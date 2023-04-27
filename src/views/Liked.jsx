import React from 'react';
import {useMedia} from '../hooks/ApiHooks';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
// import PropTypes from 'prop-types'

const Liked = (props) => {
  const {user} = useContext(MediaContext);
  const {mediaArray} = useMedia(false, false, true);
  console.log(mediaArray);

  return (
    <div>
      Liked
      <p>Likes here</p>
    </div>
  );
};

// Liked.propTypes = {}

export default Liked;
