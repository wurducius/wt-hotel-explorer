import React from 'react';
import PropTypes from 'prop-types';

import HotelListingItem from '../HotelListingItem';
import Loader from '../Loader';

const HotelListing = ({
  hotels, isLoading, isLoadingMore, showMore, fetchMoreHotels,
}) => {
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
      {showMore && (
      <div className="row text-center">
        <div className="col-12">
          <button type="button" className="btn btn-secondary btn-lg" onClick={fetchMoreHotels}>
            {isLoadingMore ? <span>Loading</span> : <span>Load more</span>}
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

HotelListing.propTypes = {
  hotels: PropTypes.instanceOf(Array).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  showMore: PropTypes.bool.isRequired,
  fetchMoreHotels: PropTypes.func.isRequired,
};

export default HotelListing;
