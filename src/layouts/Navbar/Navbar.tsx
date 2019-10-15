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
import SearchBar from '../../containers/SearchBar/SearchBar';

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

        <SearchBar />

        <div className={styles.navActions}>
          <NavLink to="/feed" activeClassName={styles.active}>
            Home
          </NavLink>

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
