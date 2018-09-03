import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actions from '../actions/hotels';

import HotelListing from '../components/HotelListing';

class Home extends React.PureComponent {
  componentDidMount() {
    // TODO do not download every time
    const { fetchInitialData } = this.props;
    fetchInitialData();
  }

  render() {
    const { hotels, isLoading } = this.props;
    return (<HotelListing hotels={hotels || []} isLoading={isLoading} />);
  }
}

Home.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  hotels: PropTypes.instanceOf(Array).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    hotels: state.hotels.list,
    isLoading: state.hotels.hotelsLoading,
  }),
  dispatch => ({
    fetchInitialData: () => dispatch(actions.fetchHotelsData()),
  }),
)(Home);
