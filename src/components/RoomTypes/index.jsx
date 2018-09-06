import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import AmenitiesList from '../AmenitiesList';

// TODO use properties, totalQuantity and occupancy

const RoomType = ({ roomType, estimate }) => (
  <div className="card">
    <img className="card-img-top" src={roomType.images[0]} alt={roomType.images[0]} />
    <div className="card-body">
      <h5 className="card-title">{roomType.name}</h5>
      <ReactMarkdown className="card-text" source={roomType.description} />
      {estimate.price && (
      <p>
        <strong>
  Available from
          {' '}
          {estimate.price}
          {' '}
          {estimate.currency}
        </strong>
      </p>
      )}
      <AmenitiesList list={roomType.amenities} />
    </div>
  </div>
);

RoomType.defaultProps = {
  estimate: {},
};

RoomType.propTypes = {
  roomType: PropTypes.instanceOf(Object).isRequired,
  estimate: PropTypes.instanceOf(Object),
};

const RoomTypes = ({ map, estimates }) => {
  const roomTypes = map && Object.values(map)
    .map(rt => (
      <RoomType
        key={rt.id}
        roomType={rt}
        estimate={estimates.find(e => e.id === rt.id)}
      />
    ));
  return roomTypes && <div>{roomTypes}</div>;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
};

export default RoomTypes;
