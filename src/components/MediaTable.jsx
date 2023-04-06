import {ImageList} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import MediaRow from './MediaRow';

const MediaTable = () => {
  const {mediaArray} = useMedia();

  return (
    <ImageList
      sx={{
        gridTemplateColumns: 'repeat(auto-fill,minmax(280px, 1fr))!important',
      }}
      gap={5}
    >
      {mediaArray.map((item, index) => {
        return <MediaRow key={index} file={item} />;
      })}
    </ImageList>
  );
};

MediaTable.propTypes = {};

export default MediaTable;
