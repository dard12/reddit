import React from 'react';
import {
  Link,
  withRouter,
  RouteComponentProps,
  NavLink,
} from 'react-router-dom';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { createSelector } from 'redux-starter-kit';
import styles from './Navbar.module.scss';
import { logoutAction, loadDocsAction } from '../../redux/actions';
import { usernameSelector, createDocListSelector } from '../../redux/selectors';
import Modal from '../../components/Modal/Modal';
import AddQuestion from '../../containers/AddQuestion/AddQuestion';
import { axios } from '../../App';
import { Button } from '../../components/Button/Button';
import SignUpModal from '../../components/SignUpModal/SignUpModal';
import { TagDoc } from '../../../src-server/models';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

interface NavbarProps extends RouteComponentProps {
  username?: string;
  tagDocs?: TagDoc[];
  logoutAction?: Function;
  loadDocsAction?: Function;
}

function Navbar(props: NavbarProps) {
  const { username, tagDocs, logoutAction, loadDocsAction } = props;
  const { result: tagResult } = useAxiosGet(
    '/api/tag',
    { approved: true },
    { cachedResult: tagDocs, name: 'Navbar' },
  );
  const { result: userResult } = useAxiosGet(
    '/api/user',
    { user_name: username },
    { cachedResult: tagDocs, name: 'Navbar' },
  );

  useLoadDocs({ collection: 'tags', result: tagResult, loadDocsAction });
  useLoadDocs({ collection: 'users', result: userResult, loadDocsAction });

  const addQuestionBtn = (openModal: any) => (
    <div>
      <Button className={styles.addQuestionBtn} onClick={openModal}>
        <span>Add Question</span>
      </Button>
    </div>
  );

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <div className={styles.brand}>
          <Link to={username ? '/questions/recent' : '/'}>Questions</Link>
          <span className={styles.subscript}>by CoverStory</span>
        </div>

        <div className={styles.navActions}>
          {!username && (
            <NavLink exact to="/questions" activeClassName={styles.active}>
              Home
            </NavLink>
          )}

          <NavLink to="/questions/recent" activeClassName={styles.active}>
            {'Recent '}
            <MediaQuery minDeviceWidth={768}>Posts</MediaQuery>
          </NavLink>

          <NavLink to="/questions/top" activeClassName={styles.active}>
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

          <MediaQuery minDeviceWidth={768}>
            {username ? (
              <Modal
                buttonRender={addQuestionBtn}
                modalRender={closeModal => (
                  <AddQuestion
                    closeModal={closeModal}
                    tagFilter={{ approved: true }}
                  />
                )}
              />
            ) : (
              <SignUpModal
                buttonRender={addQuestionBtn}
                prompt="To ask a question please "
              />
            )}
          </MediaQuery>

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

const mapStateToProps = createSelector(
  [
    createDocListSelector({
      collection: 'tags',
      filter: 'none',
      prop: 'tagDocs',
    }),
    usernameSelector,
  ],
  (a, b) => ({ ...a, ...b }),
);

export default withRouter(
  connect(
    mapStateToProps,
    { logoutAction, loadDocsAction },
  )(Navbar),
);
