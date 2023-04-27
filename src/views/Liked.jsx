import React from 'react';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import MediaTable from '../components/MediaTable';
import {Container} from '@mui/system';
import {Typography} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
// import PropTypes from 'prop-types'

const Liked = (props) => {
  const {user} = useContext(MediaContext);
  const {mediaArray} = useMedia(false, false, true);
  const likedPostsCount = mediaArray.length;

  return (
    <>
      <Container
        maxWidth="lg"
        // sx={{p: {xs: '6rem 0', sm: '3rem 3rem'}}}
        sx={{mt: {xs: 13, sm: 5}, mb: 2}}
      >
        <Typography component="h1" variant="h2">
          Posts you have liked {'(' + likedPostsCount + ')'}
        </Typography>
      </Container>
      <MediaTable myFavouritesOnly={true} />
    </>
  );
};

// Liked.propTypes = {}

export default Liked;
