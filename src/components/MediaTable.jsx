import PropTypes from 'prop-types';
import MediaRow from './MediaRow';
import React, { useState, useEffect } from 'react';

const MediaTable = () => {

  const [mediaArray, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/test.json');
      const data = await response.json();
      console.log(data);
      setData(data);
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
