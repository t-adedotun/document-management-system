import { combineReducers } from 'redux';
import authorization from './reducers/Authorization';
import displayDocuments from './reducers/DocumentsReducer';
import displayUserDocuments from './reducers/UserDocumentsReducer';
import usersInDatabase from './reducers/UserReducers';
import roles from './reducers/RoleReducers';

const appReducer = combineReducers({
  authorization,
  displayUserDocuments,
  displayDocuments,
  usersInDatabase,
  roles
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
