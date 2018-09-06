import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import ReactMarkdown from 'react-markdown';

const HotelListingItem = ({ hotel, estimates }) => {
  const currentLowestEstimate = estimates.reduce((acc, current) => {
    if (!acc.price || current.price <= acc.price) {
      return current;
    }
    return acc;
  }, {});
  return (
    <div className="card">
      <div className="card-body">
        <img className="card-img-top" src={hotel.images[0]} alt={hotel.name} />
        <h5 className="card-title">{hotel.name}</h5>
        <div className="card-text">
          <ReactMarkdown source={hotel.description} />
          {currentLowestEstimate.price && (
          <strong>
Available from
            {' '}
            {currentLowestEstimate.price}
            {' '}
            {currentLowestEstimate.currency}
          </strong>
          )}
        </div>
        <Link to={`/hotels/${hotel.id}`} className="btn btn-primary">See detail</Link>
        <HashLink to={`/hotels/${hotel.id}#hotel-map`} className="btn btn-small btn-primary float-right">See on a map</HashLink>
      </div>
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
