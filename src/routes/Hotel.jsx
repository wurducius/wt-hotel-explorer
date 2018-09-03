import React from 'react';
import PropTypes from 'prop-types';

const Hotel = ({ match }) => (
  <div>
  Hotel detail
    {' '}
    {match.params.hotelId}
  </div>
);

Hotel.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
};

export default Hotel;
