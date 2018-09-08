import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes';

// Bootstrap CSS is already imported by wt-ui
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import '@windingtree/wt-ui/dist/styles.css';
import 'animate.css/animate.css';
import './assets/css/app.scss';


ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
