import React from 'react';
import PropTypes from 'prop-types';

import HotelListingItem from '../HotelListingItem';

const HotelListing = ({ hotels }) => {
  const hotelItems = hotels.map(hotel => (
    <HotelListingItem key={hotel.id} hotel={hotel} />
  ));

  return (
    <div className="container">
      {hotels.length
        ? hotelItems
        : <h2 className="text-muted text-center">No hotels here at the moment.</h2>
          }
    </div>
  );
};

HotelListing.propTypes = {
  hotels: PropTypes.instanceOf(Array).isRequired,
};

export default HotelListing;
