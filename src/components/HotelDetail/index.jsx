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


// TODO use cancellationPolicies + defaultCancellationAmount
const HotelDetail = ({
  hotel, estimates, errors, handleGuestFormSubmit, guestFormInitialValues,
}) => (
  <React.Fragment>
    <header className="row">
      <div className="col-md-12">

        <div className="text-center">
          <h1 className="mt-1">{hotel.name}</h1>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <ReactMarkdown source={hotel.description} className="hotel-description mb-1" />
            </div>
          </div>
          <div className="mb-2">
            <AmenitiesList list={hotel.amenities} />
          </div>
        </div>

      </div>
    </header>

    <div className="row">
      <div className="col">
        <GuestForm handleSubmit={handleGuestFormSubmit} initialValues={guestFormInitialValues} />
      </div>
    </div>
    {errors.length > 0 && (
    <div className="row">
      <div className="col-md-12">
        <div className="alert alert-danger">Hotel data is not complete and price estimation might not work as expected.</div>
      </div>
    </div>
    )}

    <div className="row">
      <div className="col-md-12">
        <h3 className="mb-1 h4">Hotel Rooms</h3>
        <div className="row">
          <RoomTypes
            map={hotel.roomTypes}
            estimates={estimates}
            availableRoomTypes={Object.keys(hotel.roomTypes).length}
          />
        </div>
      </div>
    </div>

    <ScrollAnimation animateIn="fadeIn" animateOnce className="col">
      <div className="row">
        <div className="col-md-12 bg-light rounded p-2 mt-1">
          <div className="row">
            <div className="col-lg-4">
              <div className="rounded box-shadow" style={{ overflow: 'hidden' }}>
                <ImageList list={hotel.images} height={300} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="box-shadow">
                <div className="mb-1 mb-lg-0 mt-1 mt-lg-0 mb-0 map-container">
                  <LocationMap
                    name={hotel.name}
                    location={hotel.location}
                    address={hotel.address}
                  />
                </div>
              </div>

            </div>
            <div className="col-lg-4">
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
  errors: [],
};

HotelDetail.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
  errors: PropTypes.instanceOf(Array),
  handleGuestFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
};

export default HotelDetail;
