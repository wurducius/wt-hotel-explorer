import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import selectors from '../selectors';
import BookingForm from '../components/BookingForm';

const BookingWizard = ({ hotel, guestData, hotelBookingData }) => (
  // TODO if no hotel/guestData, redirect to homepage
  <BookingForm
    guestData={guestData}
    hotelBookingData={hotelBookingData}
    hotel={hotel}
  />);

BookingWizard.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  guestData: PropTypes.instanceOf(Object).isRequired,
  hotelBookingData: PropTypes.instanceOf(Object).isRequired,
};

export default connect(
  (state) => {
    const hotelBookingData = selectors.booking.getHotelData(state);
    const getHotelById = selectors.hotels.makeGetHotelById();
    return {
      hotel: getHotelById(state, hotelBookingData.id),
      guestData: selectors.booking.getGuestData(state),
      hotelBookingData,
    };
  },
  /* state => ({

  }), */
)(BookingWizard);
