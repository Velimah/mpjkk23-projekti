import React from 'react';
import MediaTable from '../components/MediaTable';
import {Container} from '@mui/system';

const Liked = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        // sx={{p: {xs: '6rem 0', sm: '3rem 3rem'}}}
        sx={{mt: {xs: 13, sm: 5}, mb: 2}}
      ></Container>
      <MediaTable myFavouritesOnly={true} />
    </>
  );
};

export default Liked;
