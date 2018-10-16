import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import actions from '../actions';
import selectors from '../selectors';

import HotelListing from '../components/HotelListing';
import Loader from '../components/Loader';
import GuestForm from '../components/GuestForm';

class Home extends React.PureComponent {
  componentDidMount() {
    const {
      fetchHotelsList, areHotelsInitialized,
      eventuallyResolveErroredHotels,
      history,
    } = this.props;
    if (!areHotelsInitialized) {
      fetchHotelsList().catch(() => {
        history.push('/error-page');
      });
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

                <header className="row">
                  <div className="col-md-12">

                    <div className="text-center">
                      <h1 className="mt-1">Hotel Explorer</h1>
                      <div className="row">
                        <div className="col-md-10 mx-auto mb-2">
                          <p className="lead mb-1">Browse hotels, check their rooms and get availability information!</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </header>

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
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(connect(
  state => ({
    hotels: selectors.hotels.getHotelsWithName(state),
    estimates: selectors.estimates.getCurrent(state),
    guestFormInitialValues: selectors.booking.getGuestData(state),
    next: selectors.hotels.getNextHotel(state),
    areHotelsInitialized: selectors.hotels.areHotelsInitialized(state),
    isLoadingMore: selectors.hotels.isLoadingMore(state),
  }),
  dispatch => ({
    fetchHotelsList: () => dispatch(actions.hotels.fetchHotelsList()),
    eventuallyResolveErroredHotels: () => dispatch(actions.hotels.eventuallyResolveErroredHotels()),
    handleGuestFormSubmit: (values) => {
      dispatch(actions.booking.setGuestData(values));
      dispatch(actions.estimates.recomputeAllPrices(values));
    },
  }),
)(Home));
