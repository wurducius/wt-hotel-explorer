import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import AmenitiesList from '../AmenitiesList';

// TODO use properties, totalQuantity and occupancy

const RoomType = ({ roomType }) => (
  <div className="card">
    <img className="card-img-top" src={roomType.images[0]} alt={roomType.images[0]} />
    <div className="card-body">
      <h5 className="card-title">{roomType.name}</h5>
      <ReactMarkdown className="card-text" source={roomType.description} />
      <AmenitiesList list={roomType.amenities} />
    </div>
  </div>
);

RoomType.propTypes = {
  roomType: PropTypes.instanceOf(Object).isRequired,
};

const RoomTypes = ({ map }) => {
  const roomTypes = map && Object.values(map).map(rt => <RoomType key={rt.id} roomType={rt} />);
  return roomTypes && <div>{roomTypes}</div>;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
};

export default RoomTypes;
