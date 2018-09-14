import React from 'react';
import PropTypes from 'prop-types';

import Carousel from '../Carousel';

const ImageList = ({ list, height, withIndicators }) => <Carousel list={list} height={height} withIndicators={withIndicators} />;

ImageList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired
};

export default ImageList;
