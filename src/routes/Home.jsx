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
    const { fetchHotelsData, areHotelsInitialized } = this.props;
    if (!areHotelsInitialized) {
      fetchHotelsData();
    }
  }

  render() {
    const {
      hotels, next, areHotelsInitialized, isLoadingMore, fetchHotelsData,
      handleGuestFormSubmit,
    } = this.props;
    return (
      <div>
        <GuestForm handleSubmit={handleGuestFormSubmit} />
        {!areHotelsInitialized
          ? <Loader block={200} label="Loading hotels from API..." />
          : (
            <HotelListing
              hotels={hotels || []}
              isLoadingMore={isLoadingMore}
              showMore={!!next}
              fetchMoreHotels={fetchHotelsData}
            />)}
      </div>
    );
  }
}

Home.defaultProps = {
  next: undefined,
};

Home.propTypes = {
  fetchHotelsData: PropTypes.func.isRequired,
  hotels: PropTypes.instanceOf(Array).isRequired,
  next: PropTypes.string,
  areHotelsInitialized: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  handleGuestFormSubmit: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    hotels: state.hotels.list,
    next: state.hotels.next,
    areHotelsInitialized: state.hotels.hotelsInitialized,
    isLoadingMore: state.hotels.hotelsLoading,
  }),
  dispatch => ({
    fetchHotelsData: () => dispatch(hotelActions.fetchHotelsData()),
    handleGuestFormSubmit: values => dispatch(estimatesActions.recomputeAllPrices(values)),
  }),
)(Home);
