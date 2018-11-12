// @flow
import React from 'react';
import ReactDom from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from './views/components/containers/App';
import { store, syncedHistory } from './store/getStore';

const render = Component => {
  ReactDom.render(
    <AppContainer>
      <Provider store={ store }>
        <ConnectedRouter history={ syncedHistory }>
          <Component />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app'));
};
render(App);

if (module.hot) {
  module.hot.accept('./views/components/containers/App', () => { render(App); } );
}
