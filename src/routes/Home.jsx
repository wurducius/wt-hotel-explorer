import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actions from '../actions/hotels';

import HotelListing from '../components/HotelListing';

class Home extends React.PureComponent {
  componentDidMount() {
    const { fetchHotelsData, hotels } = this.props;
    if (!hotels.length) {
      fetchHotelsData();
    }
  }

  render() {
    const {
      hotels, next, isLoading, isLoadingMore, fetchHotelsData,
    } = this.props;
    return (
      <HotelListing
        hotels={hotels || []}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        showMore={!!next}
        fetchMoreHotels={fetchHotelsData}
      />
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
  isLoading: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    hotels: state.hotels.list,
    next: state.hotels.next,
    isLoading: state.hotels.hotelsInitialLoading,
    isLoadingMore: state.hotels.hotelsLoading,
  }),
  dispatch => ({
    fetchHotelsData: () => dispatch(actions.fetchHotelsData()),
  }),
)(Home);
