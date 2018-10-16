import React from 'react';
import PropTypes from 'prop-types';
import RoomType from './room-type';

const RoomTypes = ({ hotel, estimates, onBookRoomTypeClicked }) => {
  const roomTypes = hotel.roomTypes && Object.values(hotel.roomTypes)
    .map((rt, index) => (
      <RoomType
        hotel={hotel}
        key={rt.id}
        roomType={rt}
        estimate={estimates.find(e => e.id === rt.id)}
        index={index}
        onBookRoomTypeClicked={onBookRoomTypeClicked}
      />
    ));
  return roomTypes && roomTypes;
};

RoomTypes.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
  onBookRoomTypeClicked: PropTypes.func.isRequired,
};

export default RoomTypes;
