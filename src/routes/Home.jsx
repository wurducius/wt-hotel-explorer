import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actions from '../actions/hotels';

import HotelListing from '../components/HotelListing';

class Home extends React.PureComponent {
  componentDidMount() {
    // TODO make this possibly more efficient
    const { fetchInitialData } = this.props;
    fetchInitialData();
  }

  render() {
    const { hotels } = this.props;
    return (<HotelListing hotels={hotels || []} />);
  }
}

Home.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  hotels: PropTypes.instanceOf(Array).isRequired,
};

export default connect(
  state => ({
    hotels: state.hotels.list,
  }),
  dispatch => ({
    fetchInitialData: () => dispatch(actions.fetchHotelsData()),
  }),
)(Home);
