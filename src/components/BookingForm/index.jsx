import React from 'react';
import PropTypes from 'prop-types';

import AccordionCard from './AccordionCard';
import HotelInfoBox from '../HotelInfoBox';

const BookingForm = ({ hotel, guestData, hotelBookingData }) => (
  <React.Fragment>
    <div className="row">
      <div className="col-md-12">
        <div className="text-center">
          <h1 className="mt-1">
Booking of
            {hotel.name}
          </h1>
        </div>
      </div>
    </div>
    <div className="row">
      <div id="booking-steps" className="col-md-12">
        <AccordionCard title="Dates" id="booking-step-dates" accordion="booking-steps" shown>
          {guestData.arrival}
          ,
          {guestData.departure}
        </AccordionCard>
        <AccordionCard title="People" id="booking-step-people" accordion="booking-steps">
            Guest information
          name, surname, age
        </AccordionCard>
        <AccordionCard title="Rooms" id="booking-step-rooms" accordion="booking-steps">
        Room type information + guest assignment
          {hotelBookingData.id}
        </AccordionCard>
        <AccordionCard title="Invoicing" id="booking-step-invoicing" accordion="booking-steps">
        Personal information
        _name, _surname, _address, _email, _phone
        note
        </AccordionCard>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <h2>Summary</h2>
          pricing, total, currency, cancellationFees
        <HotelInfoBox hotel={hotel} />
      </div>
    </div>
  </React.Fragment>
);

BookingForm.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  hotelBookingData: PropTypes.instanceOf(Object).isRequired,
  guestData: PropTypes.instanceOf(Object).isRequired,
};

export default BookingForm;
