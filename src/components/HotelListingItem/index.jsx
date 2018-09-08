import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';


const HotelListingItem = ({ hotel, estimates }) => {
  const currentLowestEstimate = estimates.reduce((acc, current) => {
    if (!acc.price || current.price <= acc.price) {
      return current;
    }
    return acc;
  }, {});
  return (
    <div className="col-lg-4">
      <ScrollAnimation animateIn="fadeInUp" animateOnce>
        <Link to={`/hotels/${hotel.id}`} className="card mb-2">
          <img className="card-img-top" src={hotel.images[0]} alt={hotel.name} />
          <div className="card-body pt-1 text-muted">
            <h5 className="card-title h6">{hotel.name}</h5>
            <div className="card-text mb-1">
              <ReactMarkdown source={hotel.description} />
              {currentLowestEstimate.price && (
              <div className="mt-1 animated fadeIn text--accent">
                <i className="mdi mdi-calendar mdi-18px text-muted" />
                {' '}
                <strong>
                  Available from
                  {' '}
                  <span className="font--alt">{currentLowestEstimate.price}</span>
                  {' '}
                  {currentLowestEstimate.currency}
                </strong>
              </div>
              )}
            </div>
            <span className="text--link border-bottom">See detail</span>
          </div>
        </Link>
      </ScrollAnimation>
    </div>
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
