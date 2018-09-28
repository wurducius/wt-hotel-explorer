import React from 'react';
import { Link } from 'react-router-dom';

var is_root = location.pathname == "/";

export default () => (
  <div id="app-header">
    <nav className="navbar navbar-expand-xl navbar-light" id="navbar">
      <div className="container">
        <Link className="navbar-brand mr-2" to="/">Winding Tree</Link>

        <div className="collapse navbar-collapse" id="navbar-content">
          <ul className="navbar-nav ml-auto" id="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link h5" to="/">Browse Hotels</Link>
            </li>
          </ul>
        </div>

        <div className="ml-lg-1">
          <button className="btn btn-block btn-primary" id="navbar-btn" type="button" data-toggle="collapse" data-target="#form-estimates" aria-expanded="false" aria-controls="form-estimates">
            Get Estimates!
          </button>
        </div>
      </div>
    </nav>
  </div>
);
