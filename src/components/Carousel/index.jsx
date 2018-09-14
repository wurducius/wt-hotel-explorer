import React from 'react';
import PropTypes from 'prop-types';

const Carousel = ({ list, height, withIndicators }) => {

  const randomId = `carousel-${Math.random().toString(36).substring(7)}`;

  const imageList = list.map((image, index) => (
    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={`carousel-${randomId}-item-${image}`}>
      {
        height ?
          <div className="img-crop" style={{ backgroundImage: `url(${image})`, height }}>
            <img className="img-fluid w-100" src={image} alt={image} />
          </div>
        :
        <img className="img-fluid w-100 " src={image} alt={image} />
      }
    </div>
  ));

  const indicators = list.map((image, index) => (
    <li
      key={`carousel-${randomId}-indicator-${index}`}
      data-target={`#${randomId}`}
      data-slide-to={index}
      className={index === 0 ? 'active' : ''}
    ></li>
  ));

  return (
    <div id={randomId} className="carousel carousel-fade slide" data-ride="carousel" data-interval="0">

      { withIndicators &&
        <ol className="carousel-indicators animated fadeIn">
          {indicators}
        </ol>
      }

      <div className="carousel-inner animated zoomIn">
        {imageList}
      </div>
      <a className="carousel-control-prev animated fadeInLeft" href={`#${randomId}`} role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next animated fadeInRight" href={`#${randomId}`} role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
};

Carousel.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired
};

export default Carousel;
