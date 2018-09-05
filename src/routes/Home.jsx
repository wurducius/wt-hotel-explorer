import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actions from '../actions/hotels';

import HotelListing from '../components/HotelListing';
import Loader from '../components/Loader';

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
    } = this.props;
    return (
      !areHotelsInitialized
        ? <Loader block={200} label="Loading hotels from API..." />
        : (
          <HotelListing
            hotels={hotels || []}
            isLoadingMore={isLoadingMore}
            showMore={!!next}
            fetchMoreHotels={fetchHotelsData}
          />
        ));
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
};

export default connect(
  state => ({
    hotels: state.hotels.list,
    next: state.hotels.next,
    areHotelsInitialized: state.hotels.hotelsInitialized,
    isLoadingMore: state.hotels.hotelsLoading,
  }),
  dispatch => ({
    fetchHotelsData: () => dispatch(actions.fetchHotelsData()),
  }),
)(Home);
