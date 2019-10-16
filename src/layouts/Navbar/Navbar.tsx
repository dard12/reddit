import React from 'react';
import {
  Link,
  withRouter,
  RouteComponentProps,
  NavLink,
} from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Navbar.module.scss';
import { logoutAction } from '../../redux/actions';
import { usernameSelector } from '../../redux/selectors';
import Modal from '../../components/Modal/Modal';
import AddQuestion from '../../containers/AddQuestion/AddQuestion';
import { axios } from '../../App';

interface NavbarProps extends RouteComponentProps {
  username?: string;
  logoutAction?: Function;
}

function Navbar(props: NavbarProps) {
  const { username, logoutAction } = props;

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <Link to={username ? '/home' : '/'} className={styles.brand}>
          CoverStory
        </Link>

        <div className={styles.navActions}>
          <NavLink to="/question" activeClassName={styles.active}>
            Home
          </NavLink>

          <Modal
            buttonChildren="Add a question"
            render={closeModal => <AddQuestion closeModal={closeModal} />}
          />

          <NavLink to="/profile">Profile</NavLink>

          {username ? (
            <NavLink
              to="/"
              className={styles.logoutBtn}
              onClick={() => {
                axios.get('/logout');
                logoutAction && logoutAction();
              }}
            >
              Logout
            </NavLink>
          ) : (
            <React.Fragment>
              <NavLink to="/register">Sign up</NavLink>
              <NavLink to="/login">Login</NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(
  connect(
    usernameSelector,
    { logoutAction },
  )(Navbar),
);
