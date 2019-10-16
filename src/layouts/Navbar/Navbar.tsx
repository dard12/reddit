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

interface NavbarProps extends RouteComponentProps {
  logoutAction?: Function;
  username?: string;
}

function Navbar(props: NavbarProps) {
  const { username } = props;

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <Link to={username ? '/home' : '/'} className={styles.brand}>
          CoverStory
        </Link>

        <div className={styles.navActions}>
          <NavLink to="/feed" activeClassName={styles.active}>
            Home
          </NavLink>

          <Modal
            buttonChildren="Add a question"
            render={closeModal => <AddQuestion closeModal={closeModal} />}
          />

          <NavLink to="/profile">Profile</NavLink>

          <NavLink to="/" className={styles.logoutBtn}>
            Logout
          </NavLink>
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
