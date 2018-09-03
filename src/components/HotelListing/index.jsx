import React from 'react';
import PropTypes from 'prop-types';

import HotelListingItem from '../HotelListingItem';
import Loader from '../Loader';

const HotelListing = ({ hotels, isLoading }) => {
  const hotelItems = hotels.map(hotel => (
    <HotelListingItem key={hotel.id} hotel={hotel} />
  ));

  if (isLoading) {
    return (<Loader block={200} label="Loading hotels from API..." />);
  }

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
  isLoading: PropTypes.bool.isRequired,
};

export default HotelListing;
