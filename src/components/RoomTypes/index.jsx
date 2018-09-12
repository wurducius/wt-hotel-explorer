import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';

import AmenitiesList from '../AmenitiesList';

// TODO use properties, totalQuantity and occupancy

const RoomType = ({ roomType, estimate }) => (

  <div className="card mb-2">
    <div className="card-img-top img-crop" style={{backgroundImage: `URL(${roomType.images[0]})`}}>
      <img src={roomType.images[0]} alt={roomType.images[0]}/>
    </div>
    <div className="card-body text-muted"  style={{minHeight: 200}}>
      <h5 className="card-title">{roomType.name}</h5>
      <ReactMarkdown className="card-text" source={roomType.description} />
    </div>

    {estimate.price && (
    <div className="card-footer bg-white pt-0">
      <div className="animated fadeIn text--accent">
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
    </div>
    )}
    <div className="card-footer bg-white pt-0">
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

const RoomTypes = ({ map, estimates, availableRooms }) => {
  const roomTypes = map && Object.values(map)
    .map((rt, index) => (
      <div className={`col-sm-12 col-md-6 col-lg-${availableRooms>2? (availableRooms>3? 3: 4) :6} d-flex`}>
        <ScrollAnimation animateIn="fadeInUp" animateOnce delay={100*index} className="w-100 d-flex">
          <RoomType
            key={rt.id}
            roomType={rt}
            estimate={estimates.find(e => e.id === rt.id)}
          />
        </ScrollAnimation>
      </div>
    ));
  return roomTypes && roomTypes;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
};

export default RoomTypes;
