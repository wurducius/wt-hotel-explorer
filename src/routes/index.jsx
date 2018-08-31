import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';
import { AppHeader, AppFooter } from 'windingtree-ui';

import Loader from '../components/Loader';

const LoadableHome = Loadable({
  loader: () => import(
    /* webpackChunkName: "Home-page" */
    /* webpackMode: "lazy" */
    './Home',
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

const AppContainer = () => (
  <div>
    <AppHeader bgClass="app-header--themed" />
    <Switch>
      <Route path="/" component={LoadableHome} />
    </Switch>
    <AppFooter />
  </div>
);

const App = () => (
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>
);

export default hot(module)(App);
