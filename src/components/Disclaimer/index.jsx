import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="alert alert-info" role="alert">
    <h4 className="alert-heading">Disclaimer</h4>
    <p>
This is a demo application showcasing current capabilities
    of
      {' '}
      <a href="https://windingtree.com" className="alert-link">Winding Tree</a>
      {' '}
platform. If you are interested in this,
    read about
    {' '}
      <Link to="/join-the-platform" className="alert-link">joining the platform</Link>
.
    </p>
  </div>
);
