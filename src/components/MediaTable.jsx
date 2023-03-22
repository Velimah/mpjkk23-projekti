import PropTypes from 'prop-types';
import MediaRow from './MediaRow';
import {useState, useEffect} from 'react';
import {baseUrl} from '../utils/variables';

const MediaTable = () => {

  const [mediaArray, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(baseUrl + 'media');
      const data = await response.json();
      console.log(data);

      const thumbs = await Promise.all(
        data.map(async (file) => {
        const response = await fetch(baseUrl + 'media/' + file.file_id);
        return await response.json();
      }));

      setData(thumbs);
      console.log(thumbs);

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <table>
      <tbody>
        {mediaArray.map((item, index) => {
          return <MediaRow key={index} file={item} />;
        })}
      </tbody>
    </table>
  );
};

export default MediaTable;
