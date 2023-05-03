import React from 'react';
import MediaTable from '../components/MediaTable';
import {Container} from '@mui/system';

const Liked = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{p: {xs: '6rem 0', sm: '3rem 3rem'}}}>
        <MediaTable myFavouritesOnly={true} />
      </Container>
    </>
  );
};

export default Liked;
