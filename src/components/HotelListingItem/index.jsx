import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ScrollAnimation from 'react-animate-on-scroll';
import { Redirect } from 'react-router';

class HotelListingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goToDetail: false,
    };
    this.goToTop = this.goToTop.bind(this);
    this.goToTopWithKeyboard = this.goToTopWithKeyboard.bind(this);
  }

  goToTop() {
    this.setState({ goToDetail: true });
    window.scrollTo(0, 0);
  }

  goToTopWithKeyboard(event) {
    if (event.key === 'Enter') {
      this.setState({ goToDetail: true });
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { hotel, estimates } = this.props;
    const { goToDetail } = this.state;

    if (goToDetail === true) {
      return (<Redirect to={`/hotels/${hotel.id}`} />);
    }

    const currentLowestEstimate = estimates.reduce((acc, current) => {
      if (!acc.price || current.price <= acc.price) {
        return current;
      }
      return acc;
    }, {});
    return (
      <ScrollAnimation animateIn="fadeInUp" animateOnce>

        <div onClick={this.goToTop} onKeyPress={this.goToTopWithKeyboard} className="card mb-2 card-with-links" role="link" tabIndex="0">
          <img src={hotel.images[0]} alt={hotel.name} className="card-img-top" />
          <div className="card-body pt-1 text-muted block-fade">
            <h5 className="card-title h6">{hotel.name}</h5>
            <div className="card-text">
              <ReactMarkdown source={hotel.description} />
            </div>
          </div>
          {currentLowestEstimate.price && (
          <div className="card-footer bg-white pt-0">
            <div className="animated fadeIn text--accent">
              <i className="mdi mdi-calendar mdi-18px text-muted" />
              {' '}
              <strong>
                  Available from
                {' '}
                <span className="font--alt">{currentLowestEstimate.price.format()}</span>
                {' '}
                {currentLowestEstimate.currency}
              </strong>
            </div>
          </div>
          )}
          <div className="card-footer bg-white pt-0">
            <span className="text--link border-bottom">See detail</span>
          </div>
        </div>
      </ScrollAnimation>
    );
  }
}

HotelListingItem.defaultProps = {
  estimates: [],
};

HotelListingItem.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
};

export default HotelListingItem;
