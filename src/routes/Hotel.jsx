import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actions from '../actions/hotels';

class Hotel extends React.PureComponent {
  componentWillMount() {
    const { fetchHotelDetail, match, hotel } = this.props;
    if (!hotel || (!hotel.hasDetailLoaded && !hotel.hasDetailLoading)) {
      fetchHotelDetail({ id: match.params.hotelId });
    }
  }

  render() {
    const { match, hotel } = this.props;
    return (
      <div>
      Hotel detail
        {' '}
        {match.params.hotelId}
        <p>{hotel && hotel.currency}</p>
      </div>
    );
  }
}

Hotel.defaultProps = {
  hotel: undefined,
};

Hotel.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  hotel: PropTypes.instanceOf(Object),
  fetchHotelDetail: PropTypes.func.isRequired,
};

export default connect(
  (state, ownProps) => ({
    hotel: state.hotels.list.find(hotel => hotel.id === ownProps.match.params.hotelId),
  }),
  dispatch => ({
    fetchHotelDetail: id => dispatch(actions.fetchHotelDetail(id)),
  }),
)(Hotel);
