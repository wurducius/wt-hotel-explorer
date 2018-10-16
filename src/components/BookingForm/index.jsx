import React from 'react';

const BookingForm = ({ guestData, hotelData }) => (
  <React.Fragment>
    <div>
      {guestData.arrival}
,
      {guestData.departure}
    </div>
    <div>
      Guest information
        name, surname, age
    </div>
    <div>
      Room type information + guest assignment
      {hotelData.id}
    </div>
    <div>
      Personal information
      _name, _surname, _address, _email, _phone
      note
    </div>
    <div>
      Summary
        pricing, total, currency, cancellationFees
    </div>
  </React.Fragment>
);

export default BookingForm;
