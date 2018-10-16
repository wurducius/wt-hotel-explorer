import React from 'react';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';
import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { Redirect } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import reducers from '../reducers';
// Lazy loaded route with attributes is working in a weird way
import Hotel from './Hotel';
import ErrorPage from './ErrorPage';

import {
  Header, Footer, Disclaimer, Loader,
} from '../components';

// The folloing import path is interpreted by webpack
// eslint-disable-next-line import/no-unresolved
import createApp from './app.TARGET_ROUTER';

// Lazy loaded routes
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

const LoadableBookingWizard = Loadable({
  loader: () => import(
    /* webpackChunkName: "Home-page" */
    /* webpackMode: "lazy" */
    './BookingWizard',
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

const Handle404 = () => <Redirect to="/error-page" />;

// Setup redux
const history = createHistory();
const routerMiddlewareInst = routerMiddleware(history);

const middleware = [thunk, routerMiddlewareInst];
const composeEnhancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose; // eslint-disable-line
const store = (() => {
  const basicStore = createStore(
    connectRouter(history)(combineReducers({
      ...reducers,
    })),
    composeEnhancers(applyMiddleware(...middleware)),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('../reducers');
      basicStore.replaceReducer(nextRootReducer);
    });
  }

  return basicStore;
})();

// App itself
const AppContainer = () => {
  const routes = (
    <Switch>
      <Route exact path="/hotels/:hotelId" component={Hotel} />
      <Route exact path="/error-page" component={ErrorPage} />
      <Route exact path="/booking" component={LoadableBookingWizard} />
      <Route exact path="/" component={LoadableHome} />
      <Route component={Handle404} />
    </Switch>
  );
  return (
    <React.Fragment>
      <Header />
      <div id="app-content" role="main">
        <div className="container">
          <Disclaimer />
          {routes}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default hot(module)(createApp({ store, history, AppContainer }));
