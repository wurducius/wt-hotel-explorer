import React from 'react';

import HotelListing from '../components/HotelListing';

const Home = ({ hotels }) => {
  hotels = hotels || [];
  return (<HotelListing hotels={hotels} />);
};

export default Home;
