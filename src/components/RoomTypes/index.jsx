import React from 'react';
import PropTypes from 'prop-types';
import RoomType from './room-type';

const RoomTypes = ({ map, estimates, availableRoomTypes }) => {
  const roomTypes = map && Object.values(map)
    .map((rt, index) => (
      <RoomType
        key={rt.id}
        roomType={rt}
        estimate={estimates.find(e => e.id === rt.id)}
        index={index}
        availableRoomTypes={availableRoomTypes}
      />
    ));
  return roomTypes && roomTypes;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
};

export default RoomTypes;
