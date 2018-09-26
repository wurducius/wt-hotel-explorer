import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import hotelActions from '../actions/hotels';
import estimatesActions from '../actions/estimates';

import HotelListing from '../components/HotelListing';
import Loader from '../components/Loader';
import GuestForm from '../components/GuestForm';

class Home extends React.PureComponent {
  componentWillMount() {
    const {
      fetchHotelsList, areHotelsInitialized,
      eventuallyResolveErroredHotels,
    } = this.props;
    if (!areHotelsInitialized) {
      fetchHotelsList();
    }
    eventuallyResolveErroredHotels();
  }

  render() {
    const {
      hotels, estimates, next, areHotelsInitialized, isLoadingMore, fetchHotelsList,
      handleGuestFormSubmit, guestFormInitialValues,
    } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          {!areHotelsInitialized
            ? <Loader block={200} label="Loading hotels from API..." />
            : (
              <React.Fragment>
                <GuestForm
                  handleSubmit={handleGuestFormSubmit}
                  initialValues={guestFormInitialValues}
                />
                <HotelListing
                  hotels={hotels || []}
                  estimates={estimates || {}}
                  isLoadingMore={isLoadingMore}
                  showMore={!!next}
                  fetchMoreHotels={fetchHotelsList}
                />
              </React.Fragment>
            )}
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  next: undefined,
};

Home.propTypes = {
  fetchHotelsList: PropTypes.func.isRequired,
  hotels: PropTypes.instanceOf(Array).isRequired,
  estimates: PropTypes.instanceOf(Object).isRequired,
  next: PropTypes.string,
  areHotelsInitialized: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  handleGuestFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
  eventuallyResolveErroredHotels: PropTypes.instanceOf(Object).isRequired,
};

export default connect(
  state => ({
    hotels: state.hotels.list.filter(h => !!h.name),
    estimates: state.estimates.current,
    guestFormInitialValues: state.estimates.guestData,
    next: state.hotels.next,
    areHotelsInitialized: state.hotels.hotelsInitialized,
    isLoadingMore: state.hotels.hotelsLoading,
  }),
  dispatch => ({
    fetchHotelsList: () => dispatch(hotelActions.fetchHotelsList()),
    eventuallyResolveErroredHotels: () => dispatch(hotelActions.eventuallyResolveErroredHotels()),
    handleGuestFormSubmit: values => dispatch(estimatesActions.recomputeAllPrices(values)),
  }),
)(Home);
