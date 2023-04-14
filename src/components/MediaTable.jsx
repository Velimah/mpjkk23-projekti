import {ImageList} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';
import PropTypes from 'prop-types';

const MediaTable = ({myFilesOnly = false}) => {
  const {mediaArray, deleteMedia} = useMedia(myFilesOnly);

  return (
    <ImageList
      sx={{
        gridTemplateColumns: 'repeat(auto-fill,minmax(280px, 1fr))!important',
      }}
      gap={5}
    >
      {mediaArray.map((item, index) => {
        return <MediaRow key={index} file={item} deleteMedia={deleteMedia} />;
      })}
    </ImageList>
  );
};

MediaTable.propTypes = {
  myFilesOnly: PropTypes.bool,
};

export default MediaTable;
