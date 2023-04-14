import {Button, ImageList} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray, deleteMedia} = useMedia(myFilesOnly);

  const [style, setStyle] = useState(true);
  const changeStyle = () => {
    setStyle(true);
  };

  const changeStyle2 = () => {
    setStyle(false);
  };

  return (
    <>
      {style === true ? (
        <Button variant="contained" onClick={changeStyle}>
          Grid
        </Button>
      ) : (
        <Button onClick={changeStyle}>Grid</Button>
      )}
      {style === false ? (
        <Button variant="contained" onClick={changeStyle2}>
          List
        </Button>
      ) : (
        <Button onClick={changeStyle2}>Grid</Button>
      )}
      <ImageList
        sx={{
          gridTemplateColumns: style
            ? 'repeat(auto-fill,minmax(300px, 1fr))!important'
            : 'repeat(auto-fill,minmax(600px, 1fr))!important',
        }}
        gap={5}
      >
        {mediaArray.map((item, index) => {
          return <MediaRow key={index} file={item} deleteMedia={deleteMedia} />;
        })}
      </ImageList>
    </>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
};

export default MediaTable;
