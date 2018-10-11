import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

import selectors from '../selectors';
import hotelActions from '../actions/hotels';
import estimatesActions from '../actions/estimates';
import Loader from '../components/Loader';
import HotelDetail from '../components/HotelDetail';
import ScrollToTopOnMount from '../components/ScrollToTopOnMount';

class Hotel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { shouldRedirectToError: false };
  }

  componentDidMount() {
    const { fetchHotelDetail, match, hotel } = this.props;
    if (!hotel || (!hotel.hasDetailLoaded && !hotel.hasDetailLoading)) {
      fetchHotelDetail({ id: match.params.hotelId }).catch(() => {
        this.setState({
          shouldRedirectToError: true,
        });
      });
    }
  }

  render() {
    const {
      hotel, estimates, errors,
      handleGuestFormSubmit, guestFormInitialValues,
    } = this.props;
    const { shouldRedirectToError } = this.state;
    if (shouldRedirectToError) {
      return <Redirect to="/error-page" />;
    }
    return (
      <Fragment>
        <ScrollToTopOnMount />
        {(!hotel || hotel.hasDetailLoading || !hotel.hasDetailLoaded)
          ? <Loader block={200} label="Loading hotel from API..." />
          : (
            <HotelDetail
              hotel={hotel}
              estimates={estimates}
              errors={errors}
              handleGuestFormSubmit={handleGuestFormSubmit}
              guestFormInitialValues={guestFormInitialValues}
            />
          )}
      </Fragment>
    );
  }
}

Hotel.defaultProps = {
  hotel: undefined,
  estimates: [],
  errors: [],
};

Hotel.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  hotel: PropTypes.instanceOf(Object),
  estimates: PropTypes.instanceOf(Array),
  errors: PropTypes.instanceOf(Array),
  fetchHotelDetail: PropTypes.func.isRequired,
  handleGuestFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
};

export default connect(
  (state, ownProps) => {
    const getHotelById = selectors.hotels.makeGetHotelById();
    const { hotelId } = ownProps.match.params;
    return {
      hotel: getHotelById(state, hotelId),
      estimates: selectors.estimates.getCurrentByHotelId(state, hotelId),
      errors: state.errors.hotels[hotelId],
      guestFormInitialValues: selectors.estimates.getGuestData(state),
    };
  },
  dispatch => ({
    fetchHotelDetail: id => dispatch(hotelActions.fetchHotelDetail(id)),
    handleGuestFormSubmit: values => dispatch(estimatesActions.recomputeAllPrices(values)),
  }),
)(Hotel);
