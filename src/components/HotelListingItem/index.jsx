import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';

const goToTop = () => {
  window.scrollTo(0, 0);
};

const HotelListingItem = ({ hotel, estimates }) => {
  const currentLowestEstimate = estimates.reduce((acc, current) => {
    if (!acc.price || current.price <= acc.price) {
      return current;
    }
    return acc;
  }, {});
  return (
    <ScrollAnimation animateIn="fadeInUp" animateOnce>

      <Link to={`/hotels/${hotel.id}`} onClick={goToTop} className="card mb-2">
        <img src={hotel.images[0]} alt={hotel.name} className="card-img-top" />
        <div className="card-body pt-1 text-muted block-fade">
          <h5 className="card-title h6">{hotel.name}</h5>
          <div className="card-text">
            <ReactMarkdown source={hotel.description} />
          </div>
        </div>
        {currentLowestEstimate.price && (
        <div className="card-footer bg-white pt-0">
          <div className="animated fadeIn text--accent">
            <i className="mdi mdi-calendar mdi-18px text-muted" />
            {' '}
            <strong>
                  Available from
              {' '}
              <span className="font--alt">{currentLowestEstimate.price.format()}</span>
              {' '}
              {currentLowestEstimate.currency}
            </strong>
          </div>
        </div>
        )}
        <div className="card-footer bg-white pt-0">
          <span className="text--link border-bottom">See detail</span>
        </div>
      </Link>
    </ScrollAnimation>
  );
};

HotelListingItem.defaultProps = {
  estimates: [],
};

HotelListingItem.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
};

export default HotelListingItem;
