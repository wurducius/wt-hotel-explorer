import React from 'react';
import PropTypes from 'prop-types';

export const QuantityBadge = ({ quantity }) => {
  if (quantity === 0) {
    return (
      <React.Fragment>
        <i className="mdi mdi-close-octagon text-danger" />
        {' '}
        <em>Sold out!</em>
      </React.Fragment>);
  }
  if (quantity < 3) {
    return (
      <React.Fragment>
        <i className="mdi mdi-alert-octagram text-warning" />
        {' '}
        <em>
Last
          {' '}
          {quantity}
          {' '}
remaining!
        </em>
      </React.Fragment>);
  }
  if (quantity === undefined) {
    return (
      <React.Fragment>
        <i className="mdi mdi-alert-circle-outline text-muted" />
        {' '}
        <em>Availability unknown</em>
      </React.Fragment>);
  }
  return null;
};

QuantityBadge.defaultProps = {
  quantity: undefined,
};

QuantityBadge.propTypes = {
  quantity: PropTypes.number,
};

export const AvailabilityBadge = ({ estimate }) => {
  let availabilityClassNames = 'text--accent';
  if (estimate.quantity === undefined) {
    availabilityClassNames = 'text-muted';
  }
  if (estimate.quantity === 0) {
    availabilityClassNames = 'text-muted text--deleted';
  }
  return (
    <React.Fragment>
      <i className="mdi mdi-calendar mdi-18px text-muted" />
      {' '}
      <strong className={availabilityClassNames}>
                  Available from
        {' '}
        <span className="font--alt">{estimate.price.format()}</span>
        {' '}
        {estimate.currency}
      </strong>
    </React.Fragment>
  );
};

AvailabilityBadge.propTypes = {
  estimate: PropTypes.instanceOf(Object).isRequired,
};

export default {
  QuantityBadge,
  AvailabilityBadge,
};
