import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import AmenitiesList from '../AmenitiesList';
import ImageList from '../ImageList';
import HotelContacts from '../HotelContacts';
/*
cancellationTerms
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
        <h3>Contact</h3>
      </div>
      <div className="col-md-6">
        <HotelContacts contacts={hotel.contacts} />
      </div>
      <div className="col-md-6">
      location.longitude
      location.latitude
      address
        line1
        line2
        postalCode
        city
        country
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
