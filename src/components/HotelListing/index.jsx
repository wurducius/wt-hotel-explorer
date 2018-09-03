import React from 'react';

import HotelListingItem from '../HotelListingItem';

export default ({ hotels }) => {
  const hotelItems = hotels.map(hotel => (
    <HotelListingItem hotel={hotel} />
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
