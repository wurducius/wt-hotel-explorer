import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import AmenitiesList from '../AmenitiesList';
import ImageList from '../ImageList';
import HotelContacts from '../HotelContacts';
import { Address, LocationMap } from '../HotelLocation';
import RoomTypes from '../RoomTypes';

/*
cancellationPolicies + defaultCancellationAmount
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
    <div className="row">
      <div className="col-md-12">
        <h3>Rooms</h3>
      </div>
      <div className="col-md-12">
        <RoomTypes map={hotel.roomTypes} />
      </div>
    </div>
    <div className="row" id="hotel-contact">
      <div className="col-md-12">
        <h3>Contact</h3>
      </div>
      <div className="col-md-4">
        <HotelContacts contacts={hotel.contacts} />
      </div>
      <div className="col-md-4">
        <Address name={hotel.name} address={hotel.address} />
      </div>
      <div className="col-md-4" id="hotel-map">
        <LocationMap name={hotel.name} location={hotel.location} address={hotel.address} />
      </div>
    </div>
  </div>
);

HotelDetail.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
};

export default HotelDetail;
