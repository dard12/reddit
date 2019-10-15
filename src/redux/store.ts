import Axios from 'axios';
import { configureStore } from 'redux-starter-kit';
import { loginReducer, collectionsReducer } from './reducers';

export const store = configureStore({
  reducer: { login: loginReducer, collections: collectionsReducer },
});

function persistLogin() {
  const { token, id, username } = store.getState().login;

  if (token && id && username) {
    localStorage.setItem('token', token);
    localStorage.setItem('id', id);
    localStorage.setItem('username', username);
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    Axios.defaults.headers.common.Authorization = null;
  }
}

persistLogin();

store.subscribe(persistLogin);
