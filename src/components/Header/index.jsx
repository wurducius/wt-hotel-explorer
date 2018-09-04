import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <nav className="navbar navbar-expand-xl navbar-light" id="navbar">
    <div className="container">
      <Link className="navbar-brand mr-2" to="/">Winding Tree</Link>

      <button className="navbar-toggler px-0 border-0" id="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-content" aria-controls="navbar-content" aria-expanded="false" aria-label="Toggle navigation">
        <i className="mdi mdi-24px mdi-menu" />
      </button>

      <div className="collapse navbar-collapse" id="navbar-content">
        <ul className="navbar-nav mr-auto" id="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link h5" to="/join-the-platform">Join the platform</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);
