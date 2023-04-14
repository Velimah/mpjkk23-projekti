import {Button, ImageList} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';
import {useState} from 'react';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray, deleteMedia} = useMedia(myFilesOnly);

  const [style, setStyle] = useState(true);
  const changeToGrid = () => {
    setStyle(true);
  };

  const changeToList = () => {
    setStyle(false);
  };

  return (
    <>
      {style === true ? (
        <Button variant="contained" onClick={changeToGrid}>
          Grid
        </Button>
      ) : (
        <Button onClick={changeToGrid}>Grid</Button>
      )}
      {style === false ? (
        <Button variant="contained" onClick={changeToList}>
          List
        </Button>
      ) : (
        <Button onClick={changeToList}>Grid</Button>
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
