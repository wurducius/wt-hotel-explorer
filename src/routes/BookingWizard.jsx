import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import selectors from '../selectors';
import BookingForm from '../components/BookingForm';

const BookingWizard = ({ guestData, hotelData }) => (
  // TODO if no hotels, redirect to homepage
  // hotel side pane,
  <BookingForm
    guestData={guestData}
    hotelData={hotelData}
  />);

// guestData
export default connect(
  state => ({
    guestData: selectors.booking.getGuestData(state),
    hotelData: selectors.booking.getHotelData(state),
  }),
)(BookingWizard);
