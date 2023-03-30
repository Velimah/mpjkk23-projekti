import {ImageList} from '@mui/material';
import {useMedia} from '../hooks/apiHooks';
import MediaRow from './MediaRow';

const MediaTable = () => {
  const {mediaArray} = useMedia();

  return (
    <ImageList cols={3}gap={5}>
      {mediaArray.map((item, index) => {
        return <MediaRow key={index} file={item} />;
      })}
    </ImageList>
  );
};

MediaTable.propTypes = {};

export default MediaTable;
