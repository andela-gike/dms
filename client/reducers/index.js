import { combineReducers } from 'redux';
import Role from './roleReducer';
import loader from './loaderReducer';

const rootReducer = combineReducers({
  Role,
  loader });

export default rootReducer;
