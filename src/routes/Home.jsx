import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import hotelActions from '../actions/hotels';
import estimatesActions from '../actions/estimates';
import selectors from '../selectors';

import HotelListing from '../components/HotelListing';
import Loader from '../components/Loader';
import GuestForm from '../components/GuestForm';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { shouldRedirectToError: false };
  }

  componentDidMount() {
    const {
      fetchHotelsList, areHotelsInitialized,
      eventuallyResolveErroredHotels,
    } = this.props;
    if (!areHotelsInitialized) {
      fetchHotelsList().catch(() => {
        this.setState({
          shouldRedirectToError: true,
        });
      });
    }
    eventuallyResolveErroredHotels();
  }

  render() {
    const {
      hotels, estimates, next, areHotelsInitialized, isLoadingMore, fetchHotelsList,
      handleGuestFormSubmit, guestFormInitialValues,
    } = this.props;
    const { shouldRedirectToError } = this.state;
    if (shouldRedirectToError) {
      return <Redirect to="/error-page" />;
    }
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
    hotels: selectors.hotels.getHotelsWithName(state),
    estimates: selectors.estimates.getCurrent(state),
    guestFormInitialValues: selectors.estimates.getGuestData(state),
    next: selectors.hotels.getNextHotel(state),
    areHotelsInitialized: selectors.hotels.areHotelsInitialized(state),
    isLoadingMore: selectors.hotels.isLoadingMore(state),
  }),
  dispatch => ({
    fetchHotelsList: () => dispatch(hotelActions.fetchHotelsList()),
    eventuallyResolveErroredHotels: () => dispatch(hotelActions.eventuallyResolveErroredHotels()),
    handleGuestFormSubmit: values => dispatch(estimatesActions.recomputeAllPrices(values)),
  }),
)(Home);
