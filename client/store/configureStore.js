// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { createBrowserHistory } from 'history';
import rootReducer from '../reducers';

export const history = createBrowserHistory();
export const routeMiddlewares = routerMiddleware(history);

const isLive =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const configureStore = (defaultState?: Object) => {
  const composer =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;  // eslint-disable-line no-underscore-dangle
  const middlewares = [ routeMiddlewares ];
  if (!isLive) middlewares.push(reduxImmutableStateInvariant());
  middlewares.push(thunk);
  return createStore(
    connectRouter(history)(rootReducer),
    defaultState,
    composer(applyMiddleware(...middlewares))
  );
};

export default configureStore;
