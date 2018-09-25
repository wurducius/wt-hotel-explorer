import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import hotelActions from '../actions/hotels';
import estimatesActions from '../actions/estimates';
import Loader from '../components/Loader';
import HotelDetail from '../components/HotelDetail';

class Hotel extends React.PureComponent {
  componentWillMount() {
    const { fetchHotelDetail, match, hotel } = this.props;
    if (!hotel || (!hotel.hasDetailLoaded && !hotel.hasDetailLoading)) {
      fetchHotelDetail({ id: match.params.hotelId }).catch(() => {}); // TODO redir to 404 page
    }
  }

  render() {
    const {
      hotel, estimates, handleGuestFormSubmit, guestFormInitialValues,
    } = this.props;
    return (
      (!hotel || hotel.hasDetailLoading)
        ? <Loader block={200} label="Loading hotel from API..." />
        : (
          <HotelDetail
            hotel={hotel}
            estimates={estimates}
            handleGuestFormSubmit={handleGuestFormSubmit}
            guestFormInitialValues={guestFormInitialValues}
          />
        )
    );
  }
}

Hotel.defaultProps = {
  hotel: undefined,
  estimates: [],
};

Hotel.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  hotel: PropTypes.instanceOf(Object),
  estimates: PropTypes.instanceOf(Array),
  fetchHotelDetail: PropTypes.func.isRequired,
  handleGuestFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
};

export default connect(
  (state, ownProps) => ({
    hotel: state.hotels.list.find(hotel => hotel.id === ownProps.match.params.hotelId),
    estimates: state.estimates.current[ownProps.match.params.hotelId],
    guestFormInitialValues: state.estimates.guestData,
  }),
  dispatch => ({
    fetchHotelDetail: id => dispatch(hotelActions.fetchHotelDetail(id)),
    handleGuestFormSubmit: values => dispatch(estimatesActions.recomputeAllPrices(values)),
  }),
)(Hotel);
