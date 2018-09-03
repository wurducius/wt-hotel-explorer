import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';

import { Header, Footer, Disclaimer, Loader } from '../components';

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
    <Header />
    <div class="container-fluid">
      <Disclaimer />
      <Switch>
        <Route path="/" component={LoadableHome} />
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
