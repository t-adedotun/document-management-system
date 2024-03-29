import findIndex from 'lodash/findIndex';
import types from '../actions/Types';

const initialState = {
  usersInDatabase: {
    paginationInfo: {},
    users: []
  }
};

/**
 * anonymous function - reducer for user actions
 *
 * @param  {object} state - current state
 * @param  {object} action - action dispatched
 * @return {object} - new state
 */
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_ALL_USERS: {
      return Object.assign({}, state, { usersInDatabase: action.allUsers });
    }

    case types.ADMIN_UPDATE_USER: {
      const index =
        findIndex(state.usersInDatabase.users, { id: action.userId });
      return Object.assign({}, state, {
        usersInDatabase: {
          paginationInfo: state.usersInDatabase.paginationInfo,
          users: [
            ...state.usersInDatabase.users.slice(0, index),
            action.updatedUser,
            ...state.usersInDatabase.users.slice(index + 1)
          ]
        }
      });
    }

    case types.DELETE_USER: {
      return Object.assign({}, state, { usersInDatabase: {
        paginationInfo: state.usersInDatabase.paginationInfo,
        users: [
          ...state.usersInDatabase.users.filter(user =>
            user.id !== action.userId
        )
        ] } });
    }

    case types.CREATE_NEW_USER: {
      const stateCopy = Object.assign({}, state);
      stateCopy.usersInDatabase.users.unshift(action.createdUser);
      return stateCopy;
    }

    default: return state;
  }
};
