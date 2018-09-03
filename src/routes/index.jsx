import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';

import {
  Header, Footer, Disclaimer, Loader,
} from '../components';

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

const LoadableJoin = Loadable({
  loader: () => import(
    /* webpackChunkName: "Home-page" */
    /* webpackMode: "lazy" */
    './Join',
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

const AppContainer = () => (
  <div>
    <Header />
    <div className="container-fluid">
      <Disclaimer />
      <Switch>
        <Route exact path="/" component={LoadableHome} />
        <Route exact path="/join-the-platform" component={LoadableJoin} />
      </Switch>
    </div>
    <Footer />
  </div>
);

const App = () => (
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>
);

export default hot(module)(App);
