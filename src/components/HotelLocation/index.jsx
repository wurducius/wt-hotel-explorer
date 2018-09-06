import React from 'react';
import PropTypes from 'prop-types';
import {
  Map, TileLayer, Marker, Popup,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

class LocationMap extends React.PureComponent {
  state = {
    zoom: 35,
  };

  render() {
    const { location, name, address } = this.props;
    const { zoom } = this.state;
    const position = [location.latitude, location.longitude];

    return (
      <Map center={position} zoom={zoom} style={{ height: 300 }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="map-popup">
              <h4>{name}</h4>
              {address.line1 && <p>{address.line1}</p>}
              {address.line2 && <p>{address.line2}</p>}
              {address.postalCode && <p>{address.postalCode}</p>}
              {address.city && <p>{address.city}</p>}
              {address.country && <p>{address.country}</p>}
            </div>
          </Popup>
        </Marker>
      </Map>
    );
  }
}

LocationMap.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.instanceOf(Object).isRequired,
};

const Address = ({ name, address }) => (
  <div>
    <h4>{name}</h4>
    {address.line1 && <p>{address.line1}</p>}
    {address.line2 && <p>{address.line2}</p>}
    {address.postalCode && <p>{address.postalCode}</p>}
    {address.city && <p>{address.city}</p>}
    {address.country && <p>{address.country}</p>}
  </div>
);

Address.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.instanceOf(Object).isRequired,
};

const HotelLocation = ({ name, location, address }) => (
  <div>
    <LocationMap location={location} address={address} name={name} />
    <Address address={address} name={name} />
  </div>
);

HotelLocation.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  address: PropTypes.instanceOf(Object).isRequired,
};

export default HotelLocation;

export {
  Address,
  LocationMap,
};
