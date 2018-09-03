import React from 'react';
import PropTypes from 'prop-types';

const HotelListingItem = ({ hotel }) => (
  <div>
    {hotel.name}
  </div>
);

HotelListingItem.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
};

export default HotelListingItem;
