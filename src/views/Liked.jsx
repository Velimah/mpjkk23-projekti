import React from 'react';
import MediaTable from '../components/MediaTable';
import {Container} from '@mui/system';
import {Typography} from '@mui/material';

const Liked = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{p: {xs: '6rem 0', sm: '3rem 0'}}}>
        <Typography component="h1" variant="h1" textAlign="center" sx={{mb: 5}}>
          Your liked posts
        </Typography>
        <MediaTable myFavouritesOnly={true} />
      </Container>
    </>
  );
};

export default Liked;
