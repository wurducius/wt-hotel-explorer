import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import selectors from '../selectors';
import actions from '../actions';
import Loader from '../components/Loader';
import HotelDetail from '../components/HotelDetail';
import ScrollToTopOnMount from '../components/ScrollToTopOnMount';

class Hotel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.startBooking = this.startBooking.bind(this);
  }

  componentDidMount() {
    const {
      fetchHotelDetail, match, hotel, history,
    } = this.props;
    if (!hotel || (!hotel.hasDetailLoaded && !hotel.hasDetailLoading)) {
      fetchHotelDetail({ id: match.params.hotelId }).catch(() => {
        history.push('/error-page');
      });
    }
  }

  startBooking(hotelId, roomTypeId) {
    const { handleBookRoomTypeClicked, history } = this.props;
    handleBookRoomTypeClicked(hotelId, roomTypeId);
    history.push('/booking');
  }

  render() {
    const {
      hotel, estimates, errors,
      handleGuestFormSubmit, guestFormInitialValues,
    } = this.props;
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
              handleBookRoomTypeClicked={this.startBooking}
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
  handleBookRoomTypeClicked: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(connect(
  (state, ownProps) => {
    const getHotelById = selectors.hotels.makeGetHotelById();
    const { hotelId } = ownProps.match.params;
    return {
      hotel: getHotelById(state, hotelId),
      estimates: selectors.estimates.getCurrentByHotelId(state, hotelId),
      errors: state.errors.hotels[hotelId],
      guestFormInitialValues: selectors.booking.getGuestData(state),
    };
  },
  dispatch => ({
    fetchHotelDetail: id => dispatch(actions.hotels.fetchHotelDetail(id)),
    handleGuestFormSubmit: (values) => {
      dispatch(actions.booking.setGuestData(values));
      dispatch(actions.estimates.recomputeAllPrices(values));
    },
    handleBookRoomTypeClicked: (hotelId, roomTypeId) => {
      // TODO actually do something - store roomTypeId and hotelId into redux store
      console.log(hotelId, roomTypeId);
    },
  }),
)(Hotel));
