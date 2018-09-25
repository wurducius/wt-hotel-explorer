import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';
import ImageList from '../ImageList';

import AmenitiesList from '../AmenitiesList';

const QuantityBadge = ({ quantity }) => {
  if (quantity === 0) {
    return <div>Sold out!</div>;
  }
  if (quantity < 3) {
    return (
      <div>
Last
        {' '}
        {quantity}
        {' '}
remaining!
      </div>
    );
  }
  if (quantity === undefined) {
    return <div>Availability unknown</div>;
  }
  return null;
};

QuantityBadge.defaultProps = {
  quantity: undefined,
};

QuantityBadge.propTypes = {
  quantity: PropTypes.number,
};

// TODO use properties, totalQuantity and occupancy

const RoomType = ({
  roomType, estimate, index,
}) => (
  <React.Fragment>
    <div className="col-sm-12 col-md-6 col-lg-4 d-flex">
      <ScrollAnimation animateIn="fadeInUp" animateOnce delay={100 * index} className="w-100 d-flex">
        <div className="card mb-2">
          <button className="card-img-top area-btn" type="button" data-toggle="modal" data-target={`#roomModal-${index + 1}`}>
            <div className="img-crop" style={{ backgroundImage: `URL(${roomType.images[0]})` }}>
              <img src={roomType.images[0]} alt={roomType.images[0]} />
            </div>

            <div className="area-btn__btn">
              <i className="mdi mdi-18px text-white mdi-arrow-expand" />
              <span className="d-none">View Photos</span>
            </div>
          </button>

          <div className="card-body pt-1 text-muted" style={{ minHeight: 200 }}>
            <h5 className="card-title h6">{roomType.name}</h5>
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
                  {estimate.price.format()}
                </span>
                {' '}
                {estimate.currency}
              </strong>
            </div>
          </div>
          )}
          {estimate.price && (<QuantityBadge quantity={estimate.quantity} />)}
          <div className="card-footer bg-white pt-0">
            <AmenitiesList list={roomType.amenities} />
          </div>
        </div>
      </ScrollAnimation>
    </div>

    {/* Modal */}
    <div className="modal modal--carousel" id={`roomModal-${index + 1}`} tabIndex={`-${index + 1}`} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title animated fadeIn">{roomType.name}</h5>
            <button type="button" className="close animated fadeIn" data-dismiss="modal" aria-label="Close">
              <i className="mdi mdi-close" />
            </button>
          </div>
          <div className="modal-body d-flex align-items-center animated fadeIn">
            <ImageList list={roomType.images} withIndicators />
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
  index: PropTypes.number.isRequired,
};

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
