import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';
import ImageList from '../ImageList';

import AmenitiesList from '../AmenitiesList';

// TODO use properties, totalQuantity and occupancy

const RoomType = ({ roomType, estimate, index, availableRooms }) => (
  <React.Fragment>
  <div className={`col-sm-12 col-md-6 col-lg-${availableRooms>2? (availableRooms>3? 3: 4) :6} d-flex`}>
    <ScrollAnimation animateIn="fadeInUp" animateOnce delay={100*index} className="w-100 d-flex">
      <div className="card mb-2">
        <div className="card-img-top">
          <button className="card-img-top area-btn" type="button"data-toggle="modal" data-target={`#roomModal-${index+1}`}>
            <div className="img-crop" style={{backgroundImage: `URL(${roomType.images[0]})`}}>
              <img src={roomType.images[0]} alt={roomType.images[0]}/>
            </div>

            <div  className="area-btn__btn" >
              <i className="mdi mdi-18px text-white mdi-arrow-expand"/>
              <span className="d-none">View Photos</span>
            </div>
          </button>
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

    </ScrollAnimation>
  </div>

  <div className="modal modal--carousel" id={`roomModal-${index+1}`} tabIndex={`-${index+1}`} role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <i className="mdi mdi-close"></i>
          </button>
        </div>
        <div className="modal-body d-flex align-items-center animated fadeIn">
          <ImageList list={roomType.images} />
        </div>
      </div>
    </div>
  </div>

  </React.Fragment>
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
      <RoomType
        key={rt.id}
        roomType={rt}
        estimate={estimates.find(e => e.id === rt.id)}
        index={index}
        availableRooms={availableRooms}
      />
    ));
  return roomTypes && roomTypes;
};

RoomTypes.propTypes = {
  map: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
};

export default RoomTypes;
