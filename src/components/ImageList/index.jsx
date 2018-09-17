import React from 'react';
import PropTypes from 'prop-types';

import Carousel from '../Carousel';

const ImageList = ({ list, height, withIndicators }) => (
  <Carousel
    list={list}
    height={height}
    withIndicators={withIndicators}
  />
);

ImageList.defaultProps = {
  height: undefined,
  withIndicators: false,
};

ImageList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
  height: PropTypes.number,
  withIndicators: PropTypes.bool,
};

export default ImageList;
