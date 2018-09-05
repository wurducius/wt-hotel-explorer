import React from 'react';
import PropTypes from 'prop-types';

const AmenitiesList = ({ list }) => {
  const amenitiesList = list && list.map(amenity => (
    <span key={amenity} className="badge badge-pill badge-primary">{amenity}</span>
  ));
  return amenitiesList && <span>{amenitiesList}</span>;
};

AmenitiesList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

export default AmenitiesList;
