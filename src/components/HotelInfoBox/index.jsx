import React from 'react';
import PropTypes from 'prop-types';

import ImageList from '../ImageList';
import HotelContacts from '../HotelContacts';
import { Address, LocationMap } from '../HotelLocation';

const HotelInfoBox = ({ hotel }) => (
  <div className="row">
    <div className="col-md-12 bg-light rounded p-2 mt-1">
      <div className="row">
        {hotel.images && (
        <div className="col-lg-4">
          <div className="rounded box-shadow" style={{ overflow: 'hidden' }}>
            <ImageList list={hotel.images} height={300} />
          </div>
        </div>
        )}
        <div className="col-lg-4">
          <div className="box-shadow">
            <div className="mb-1 mb-lg-0 mt-1 mt-lg-0 mb-0 map-container">
              <LocationMap
                name={hotel.name}
                location={hotel.location}
                address={hotel.address}
              />
            </div>
          </div>

        </div>
        <div className="col-lg-4">
          <Address name={hotel.name} address={hotel.address} />
          <h5 className="mt-1">Contact</h5>
          <HotelContacts contacts={hotel.contacts} />
        </div>
      </div>
    </div>
  </div>
);

HotelInfoBox.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
};

export default HotelInfoBox;
