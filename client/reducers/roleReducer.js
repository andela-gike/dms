import initialState from './initialState';

export default function roleReducer(state = initialState.manageRoles.roles , action) {
  switch(action.type) {
    case 'CREATE_ROLE':
      return [ ...state, Object.assign({}, action.role) ];
    default:
      return state;
  }
}
