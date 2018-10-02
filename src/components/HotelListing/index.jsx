import React from 'react';
import PropTypes from 'prop-types';

import Masonry from 'react-masonry-css';

import HotelListingItem from '../HotelListingItem';

const HotelListing = ({
  hotels, estimates, isLoadingMore, showMore, fetchMoreHotels,
}) => {
  const hotelItems = hotels.map(hotel => (
    <HotelListingItem key={hotel.id} hotel={hotel} estimates={estimates[hotel.id]} />
  ));

  const breakpointColumnsObj = {
    default: 3,
    1200: 3,
    992: 2,
    768: 1,
  };

  return (
    <div>
      {hotels.length
        ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid__col"
          >
            {hotelItems}
          </Masonry>
        )
        : <h2 className="h3 text-muted text-center">No hotels here at the moment.</h2>
      }
      {showMore && (
      <div className="row text-center">
        <div className="col-12">
          <button type="button" className={`btn btn-secondary ${isLoadingMore ? 'disabled' : ''}`} onClick={fetchMoreHotels} disabled={isLoadingMore}>
            {isLoadingMore ? (
              <span>
                <i className="mdi mdi-loading mdi-spin text-light" />
                {' '}
                <span>Loading...</span>
              </span>
            ) : <span>Load more</span>}
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

HotelListing.propTypes = {
  hotels: PropTypes.instanceOf(Array).isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  showMore: PropTypes.bool.isRequired,
  fetchMoreHotels: PropTypes.func.isRequired,
  estimates: PropTypes.instanceOf(Object).isRequired,
};

export default HotelListing;
