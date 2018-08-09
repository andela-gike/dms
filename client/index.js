// @flow
import React from 'react';
import { render } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import App from './views/components/containers/App';
import { store, syncedHistory } from './store/getStore';

render(
  <Provider store={ store }>
    <ConnectedRouter history={ syncedHistory }>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'));
