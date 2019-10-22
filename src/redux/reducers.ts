import _ from 'lodash';
import { createReducer } from 'redux-starter-kit';
import { loginAction, logoutAction, loadDocsAction } from './actions';

interface LoginInterface {
  token: string | null;
  id: string | null;
  username: string | null;
}

interface CollectionsInterface {
  [name: string]: { [docId: string]: any };
}

export const loginReducer = createReducer<LoginInterface>(
  {
    token: localStorage.getItem('token'),
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
  },
  {
    [loginAction.type]: (state, action) => {
      const { token, id, username } = action.payload;
      state.token = token;
      state.id = id;
      state.username = username;
      localStorage.removeItem('redirect');
    },

    [logoutAction.type]: (state, action) => {
      state.token = null;
      state.id = null;
      state.username = null;
    },
  },
);

export const collectionsReducer = createReducer<CollectionsInterface>(
  {},
  {
    [loadDocsAction.type]: (state, action) => {
      const { docs, name } = action.payload;

      _.each(docs, doc => {
        if (name === 'users') {
          state[name] = { ...state[name], [doc.id]: doc, [doc.user_name]: doc };
        } else {
          state[name] = { ...state[name], [doc.id]: doc };
        }
      });
    },
  },
);
