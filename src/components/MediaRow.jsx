import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
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
        <Link to="/single" state={{file}}>
          View
        </Link>
      </td>
    </tr>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object.isRequired,
};

export default MediaRow;
