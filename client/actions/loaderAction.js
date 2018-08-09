import ActionTypes from './actionTypes';

export function startPageLoad() {
  return { type: ActionTypes.START_PAGE_LOAD, loader: { pageLoading: true } };
}

export function stopPageLoad() {
  return { type: ActionTypes.STOP_PAGE_LOAD, loader: { pageLoading: false } };
}

export function beginAjaxCall() {
  return { type: ActionTypes.BEGIN_AJAX_CALL };
}

export function ajaxCallError() {
  return { type: ActionTypes.AJAX_CALL_ERROR };
}