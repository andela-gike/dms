import configureStore, { history } from './configureStore';

export const store = configureStore();
export const syncedHistory = history;

export default {
  store,
  history
};
