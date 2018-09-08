import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';

import AmenitiesList from '../AmenitiesList';

// TODO use properties, totalQuantity and occupancy

const RoomType = ({ roomType, estimate }) => (
  <div className="col-sm-12 col-md-6 col-lg-3 XXXd-flex">
    <ScrollAnimation animateIn="fadeInUp" animateOnce>
      <div className="card mb-2">
        <img className="card-img-top" src={roomType.images[0]} alt={roomType.images[0]} />
        <div className="card-body text-muted">
          <h5 className="card-title">{roomType.name}</h5>
          <ReactMarkdown className="card-text" source={roomType.description} />
          <div className="mt-1">
            <AmenitiesList list={roomType.amenities} />
          </div>
          {estimate.price && (
          <div className="mt-1 animated fadeIn text--accent">
            <i className="mdi mdi-calendar mdi-18px text-muted" />
            {' '}
            <strong>
              Available from
              {' '}
              <span className="font--alt">
                {estimate.price}
              </span>
              {' '}
              {estimate.currency}
            </strong>
          </div>
          )}
        </div>
      </div>
    </ScrollAnimation>
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
  return roomTypes && roomTypes;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
};

export default RoomTypes;
