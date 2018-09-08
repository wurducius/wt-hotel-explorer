import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div id="app-header">
    <nav className="navbar navbar-expand-xl navbar-light" id="navbar">
      <div className="container">
        <Link className="navbar-brand mr-2" to="/">Winding Tree</Link>

        <div id="navbar-content">
          <div className="ml-auto">
            <Link to="/join-the-platform" className="btn btn-block btn-primary " id="navbar-btn">
              Join
              {' '}
              <span className="d-none d-sm-inline">Platform</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  </div>
);
