import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';


const createApp = ({ store, AppContainer }) => () => (
  <Provider store={store}>
    <HashRouter>
      <AppContainer />
    </HashRouter>
  </Provider>
);
export default createApp;
