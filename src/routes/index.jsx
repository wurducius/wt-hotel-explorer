import React from 'react';
import Loadable from 'react-loadable';
import { hot } from 'react-hot-loader';
import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import reducers from '../reducers';
// Lazy loaded route with attributes is working in a weird way
import Hotel from './Hotel';

import {
  Header, Footer, Disclaimer, Loader,
} from '../components';

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

const LoadableJoin = Loadable({
  loader: () => import(
    /* webpackChunkName: "Join-page" */
    /* webpackMode: "lazy" */
    './Join',
  ),
  loading() {
    return <Loader block={200} label="Loading..." />;
  },
});

// Setup redux
const history = createHistory();
const routerMiddlewareInst = routerMiddleware(history);

const middleware = [thunk, routerMiddlewareInst];
const composeEnhancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose; // eslint-disable-line
const store = createStore(
  connectRouter(history)(combineReducers({
    ...reducers,
  })),
  composeEnhancers(applyMiddleware(...middleware)),
);


// App itself
const AppContainer = () => (
  <React.Fragment>
    <Header />
    <div id="app-content" role="main">
      <div className="container">
        <Disclaimer />
        <Switch>
          <Route exact path="/" component={LoadableHome} />
          <Route exact path="/hotels/:hotelId" component={Hotel} />
          <Route exact path="/join-the-platform" component={LoadableJoin} />
        </Switch>
      </div>
    </div>
    <Footer />
  </React.Fragment>
);

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppContainer />
    </ConnectedRouter>
  </Provider>
);

export default hot(module)(App);
