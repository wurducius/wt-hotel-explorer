import React from 'react';
import PropTypes from 'prop-types';

const AmenitiesList = ({ list }) => {
  const amenitiesList = list.map(amenity => (
    <span key={amenity} className="badge badge-pill badge-primary">{amenity}</span>
  ));
  return (
    <span>{amenitiesList.length && amenitiesList}</span>
  );
};

AmenitiesList.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

export default AmenitiesList;
