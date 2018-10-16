import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';
import ImageList from '../ImageList';
import AmenitiesList from '../AmenitiesList';
import { QuantityBadge, AvailabilityBadge } from './badges';
import imagePlaceholder from '../../assets/img/placeholder.png';

// TODO use properties, totalQuantity and occupancy

class RoomType extends React.PureComponent {
  render() {
    const { roomType, estimate, index } = this.props;

    const selectedImage = (roomType.images && roomType.images.length)
      ? roomType.images[0]
      : imagePlaceholder;
    return (
      <React.Fragment>
        <div className="col-sm-12 col-md-6 col-lg-4 d-flex">
          <ScrollAnimation animateIn="fadeInUp" animateOnce delay={100 * index} className="w-100 d-flex">
            <div className="card mb-2">
              <button className="card-img-top area-btn" type="button" data-toggle="modal" data-target={`#roomModal-${index + 1}`}>
                <div className="img-crop" style={{ backgroundImage: `URL(${selectedImage})` }}>
                  <img src={selectedImage} alt={selectedImage} />
                </div>
                <div className="area-btn__btn">
                  <i className="mdi mdi-18px text-white mdi-arrow-expand" />
                  <span className="d-none">View Photos</span>
                </div>
              </button>

              <div className="card-body pt-1 text-muted" style={{ minHeight: 200 }}>
                <h5 className="card-title h6">{roomType.name}</h5>
                <ReactMarkdown className="card-text text--weight-normal" source={roomType.description} />
              </div>

              {estimate.price && (
              <div className="room-price card-footer bg-white pb-0">
                <div className="animated fadeIn">
                  <p>
                    <AvailabilityBadge estimate={estimate} />
                  </p>
                  <QuantityBadge quantity={estimate.quantity} />
                </div>
              </div>
              )}
              {roomType.amenities && (
                <div className="card-footer bg-white">
                  <AmenitiesList list={roomType.amenities} />
                </div>
              )}
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
  }
}


RoomType.defaultProps = {
  estimate: {},
};

RoomType.propTypes = {
  roomType: PropTypes.instanceOf(Object).isRequired,
  estimate: PropTypes.instanceOf(Object),
  index: PropTypes.number.isRequired,
};

export default RoomType;
