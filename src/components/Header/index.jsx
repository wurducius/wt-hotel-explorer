import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div id="app-header">
    <nav className="navbar navbar-expand-xl navbar-light" id="navbar">
      <div className="container">
        <Link className="navbar-brand mr-2" to="/">Winding Tree</Link>
      </div>
    </nav>
  </div>
);
