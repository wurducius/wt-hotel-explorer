import React from 'react';
import PropTypes from 'prop-types';

import Carousel from '../Carousel';

const ImageList = ({ list }) => <Carousel list={list} />;

ImageList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

export default ImageList;
