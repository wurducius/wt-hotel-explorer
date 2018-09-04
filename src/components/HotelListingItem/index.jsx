import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const HotelListingItem = ({ hotel }) => {
  const mapsLink = `https://www.google.com/maps/place/${hotel.location.latitude}+${hotel.location.longitude}`;
  return (
    <div className="card">
      <div className="card-body">
        <img className="card-img-top" src={hotel.images[0]} alt={hotel.name} />
        <h5 className="card-title">{hotel.name}</h5>
        <div className="card-text">
          <ReactMarkdown source={hotel.description} />
        </div>
        <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">See detail</Link>
        <a href={mapsLink} className="btn btn-small btn-primary float-right">See on a map</a>
      </div>
    </div>
  );
};

HotelListingItem.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
};

export default HotelListingItem;
