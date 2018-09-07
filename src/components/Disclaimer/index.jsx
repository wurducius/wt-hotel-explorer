import React from 'react';
import { Link } from 'react-router-dom';


export default () => (
    <div className="row animated fadeIn">
      <div className="col">
        <div className="alert alert-light border border-info p-1 mb-1" role="alert">

          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <i className="mdi mdi-close"/>
          </button>

          <h4 className="alert-heading text-dark">Disclaimer</h4>
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
      </div>
    </div>
);
