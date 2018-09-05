import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import AmenitiesList from '../AmenitiesList';
import ImageList from '../ImageList';
/*
cancellationTerms
contacts
map
address
currency
?link to etherscan?
roomTypes - pictures
*/
const HotelDetail = ({ hotel }) => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <h1>
          {hotel.name}
        </h1>
        <AmenitiesList list={hotel.amenities} />
        <ReactMarkdown source={hotel.description} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <ImageList list={hotel.images} />
      </div>
    </div>
  </div>
);

HotelDetail.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
};

export default HotelDetail;
