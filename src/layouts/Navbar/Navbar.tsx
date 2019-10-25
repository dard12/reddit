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
import { Button } from '../../components/Button/Button';
import SignUpModal from '../../components/SignUpModal/SignUpModal';

interface NavbarProps extends RouteComponentProps {
  username?: string;
  logoutAction?: Function;
}

function Navbar(props: NavbarProps) {
  const { username, logoutAction } = props;

  const addQuestionBtn = (
    <Button className={styles.addQuestionBtn}>Add a Question</Button>
  );

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <Link to="/home" className={styles.brand}>
          CoverStory
        </Link>

        <div className={styles.navActions}>
          <NavLink to="/home" activeClassName={styles.active}>
            Home
          </NavLink>

          <NavLink to="/question" activeClassName={styles.active}>
            Top Questions
          </NavLink>

          {username && (
            <NavLink
              to={`/profile/${username}`}
              activeClassName={styles.active}
            >
              Profile
            </NavLink>
          )}

          {username ? (
            <Modal
              buttonChildren={addQuestionBtn}
              render={closeModal => <AddQuestion closeModal={closeModal} />}
            />
          ) : (
            <SignUpModal
              buttonChildren={addQuestionBtn}
              prompt="To add a question please "
            />
          )}

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
