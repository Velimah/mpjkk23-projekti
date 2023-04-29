import React from 'react';
import {useContext, useState, useEffect} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import MediaTable from '../components/MediaTable';
import {Container} from '@mui/system';

const Liked = () => {
  const {user, setUser} = useContext(MediaContext);

  const [userData, setData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, [setData]);

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
