import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';

const MediaRow = ({file}) => {
  return (
    <tr>
      <td>
        <img src={mediaUrl + file.thumbnails.w320} alt={file.title} />
      </td>
      <td>
        <h3>{file.title}</h3>
        <p>{file.description}</p>
        <p>{file.time_added}</p>
        <p>User ID: {file.user_id}</p>
      </td>
      <td>
        <a href={mediaUrl + file.filename}>View</a>
      </td>
    </tr>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
};

export default MediaRow;
