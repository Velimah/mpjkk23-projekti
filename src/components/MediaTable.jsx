import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {useMedia} from '../hooks/apiHooks';
import {baseUrl} from '../utils/variables';
import MediaRow from './MediaRow';

const MediaTable = () => {
  const {mediaArray} = useMedia();

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

MediaTable.propTypes = {};

export default MediaTable;
