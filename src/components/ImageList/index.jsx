import React from 'react';
import PropTypes from 'prop-types';
import Carousel from '../Carousel';
import imagePlaceholder from '../../assets/img/placeholder.png';

const ImageList = ({ list, height, withIndicators }) => {
  const imageList = list.length ? list : [imagePlaceholder];
  return (
    <Carousel
      list={imageList}
      height={height}
      withIndicators={withIndicators}
    />);
};

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
