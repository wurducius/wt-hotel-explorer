import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';

import AmenitiesList from '../AmenitiesList';
import ImageList from '../ImageList';
import HotelContacts from '../HotelContacts';
import { Address, LocationMap } from '../HotelLocation';
import RoomTypes from '../RoomTypes';
import GuestForm from '../GuestForm';

/*
cancellationPolicies + defaultCancellationAmount
*/
const HotelDetail = ({
  hotel, estimates, handleGuestFormSubmit, guestFormInitialValues,
}) => (
  <React.Fragment>
    <div className="row">
      <div className="col-md-12">

        <div className="text-center">
          <h1 className="mt-1"> {hotel.name} </h1>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <ReactMarkdown source={hotel.description} className="hotel-description mb-1"/>
            </div>
          </div>
          <div className="mb-2">
            <AmenitiesList list={hotel.amenities}/>
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <GuestForm handleSubmit={handleGuestFormSubmit} initialValues={guestFormInitialValues} />
      </div>
    </div>

    <div className="row">
      <div className="col-md-12">
        <h3 className="mb-1 h4">Hotel Rooms</h3>
        <div className="row">
          <RoomTypes map={hotel.roomTypes} estimates={estimates} />
        </div>
      </div>
    </div>

    <ScrollAnimation animateIn="fadeIn" animateOnce={true}>
      <div className="row">
        <div className="col-md-12 bg-light p-2 rounded mt-1">
          <div className="row">
            <div className="col-lg-4">
              <ImageList list={hotel.images}/>
            </div>
            <div className="col-lg-4">
              <LocationMap name={hotel.name} location={hotel.location} address={hotel.address} />

            </div>
            <div className="col-lg-4">
              <h5>Address</h5>
              <Address name={hotel.name} address={hotel.address} />
              <h5 className="mt-1">Contact</h5>
              <HotelContacts contacts={hotel.contacts} />
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>

  </React.Fragment>
);

HotelDetail.defaultProps = {
  estimates: [],
};

HotelDetail.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
  handleGuestFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
};

export default HotelDetail;
