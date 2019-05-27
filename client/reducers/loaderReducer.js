import initialState from './initialState';
import types from '../actions/actionTypes';

function actionTypeEndsInSuccess(type) {
  return type && type.substring(type.length - 8) == '_SUCCESS';
}

function changeAjaxCall(state, increment) {
  let value = state.ajaxCalls;
  value = increment ? value + 1 : value > 0 ? value - 1 : value;
  const newState = Object.assign({}, { ajaxCalls: value });
  return newState;
}

export default (state = initialState.loader, action) => {
  if (actionTypeEndsInSuccess(action.type)) {
    return Object.assign({}, state, changeAjaxCall(state, false));
  }
  switch (action.type) {
    case types.START_PAGE_LOAD:
      return Object.assign({}, state, action.loader);
    case types.STOP_PAGE_LOAD:
      return Object.assign({}, state, action.loader);
    case types.BEGIN_AJAX_CALL:
      return Object.assign({}, state, changeAjaxCall(state, true));
    case types.AJAX_CALL_ERROR:
      return Object.assign({}, state, changeAjaxCall(state, false));
    default:
      return state;
  }
};
