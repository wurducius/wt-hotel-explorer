import React from 'react';
import PropTypes from 'prop-types';

import Carousel from '../Carousel';

const ImageList = ({ list, height }) => <Carousel list={list} height={height}/>;

ImageList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

export default ImageList;
