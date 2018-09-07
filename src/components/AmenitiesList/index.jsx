import React from 'react';
import PropTypes from 'prop-types';

const AmenitiesList = ({ list }) => {
  const amenitiesList = list && list.map(amenity => (
    <span key={amenity} className="badge badge-secondary badge-pill">{amenity}</span>
  ));
  return amenitiesList && <span>{amenitiesList}</span>;
};

AmenitiesList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

export default AmenitiesList;
