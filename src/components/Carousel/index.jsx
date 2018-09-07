import React from 'react';
import PropTypes from 'prop-types';

const Carousel = ({ list }) => {
  const randomId = `carousel-${Math.random().toString(36).substring(7)}`;
  const imageList = list.map((image, index) => (
    <div className={`carousel-item ${index===0 ? 'active' : ''}`} key={`carousel-${randomId}-item-${image}`}>
      <div className="img-crop" style={{backgroundImage: `url(${image})`}}>
        <img className="img-fluid w-100 rounded" src={image} alt={image}/>
      </div>
    </div>
  ));

  const indicators = list.map((image, i) => (
    <li key={`carousel-${randomId}-indicator-${image}`} data-target="#carouselIndicators" data-slide-to={i} />
  ));


  return (
    <div id={randomId} className="carousel slide" data-ride="carousel" data-interval="5000">
      <div className="carousel-inner">
        {imageList}
      </div>
      <a className="carousel-control-prev" href={`#${randomId}`} role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href={`#${randomId}`} role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
};

Carousel.propTypes = {
  list: PropTypes.instanceOf(Array).isRequired,
};

export default Carousel;
