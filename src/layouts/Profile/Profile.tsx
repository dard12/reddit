import React from 'react';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import styles from './Profile.module.scss';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { UserDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import UserName from '../../containers/UserName/UserName';
import Paging from '../../containers/Paging/Paging';
import QuestionListPage from '../../containers/QuestionListPage/QuestionListPage';
import CommentListPage from '../../containers/CommentListPage/CommentListPage';

interface ProfileProps {
  user?: string;
  userDoc?: UserDoc;
  page?: string;
  targetUsername?: string;
  loadDocsAction?: Function;
}

function Profile(props: ProfileProps) {
  const { userDoc, targetUsername, loadDocsAction } = props;
  const params = { user_name: targetUsername };
  const { result } = useAxiosGet('/api/user', params, {
    name: 'Profile',
    reloadOnChange: true,
    cachedResult: userDoc,
  });

  useLoadDocs({ collection: 'users', result, loadDocsAction });

  if (!userDoc) {
    return (
      <div className={styles.profilePage}>
        <Skeleton card count={4} />
      </div>
    );
  }

  const targetUser = userDoc.id;
  const answersLink = `/profile/${targetUsername}/answers`;
  const commentsLink = `/profile/${targetUsername}/comments`;
  const questionsLink = `/profile/${targetUsername}/questions`;
  const upvotesLink = `/profile/${targetUsername}/upvotes`;
  const downvotesLink = `/profile/${targetUsername}/downvotes`;

  return (
    <div className={styles.profilePage}>
      <div>
        <div className={styles.profileCard}>
          <div>
            <div className={styles.profileName}>
              <UserName user={targetUser} plainName />
            </div>
            @<UserName user={targetUser} plainName />
          </div>

          <div className={styles.profileRight}>
            <div>
              <b>Joined</b>
            </div>
            <div>October 2019</div>
          </div>
        </div>

        <div className="tabs">
          <NavLink to={answersLink} activeClassName="active">
            Answers
          </NavLink>
          <NavLink to={commentsLink} activeClassName="active">
            Comments
          </NavLink>
          <NavLink to={questionsLink} activeClassName="active">
            Questions
          </NavLink>
          <NavLink to={upvotesLink} activeClassName="active">
            Upvotes
          </NavLink>
          <NavLink to={downvotesLink} activeClassName="active">
            Downvotes
          </NavLink>
        </div>
      </div>

      <Switch>
        <Route
          path={answersLink}
          render={() => (
            <Paging
              component={CommentListPage}
              params={{ author_id: targetUser, is_answer: true }}
            />
          )}
        />
        <Route
          path={commentsLink}
          render={() => (
            <Paging
              component={CommentListPage}
              params={{ author_id: targetUser, is_answer: false }}
            />
          )}
        />
        <Route
          path={questionsLink}
          render={() => (
            <Paging
              component={QuestionListPage}
              params={{ author_id: targetUser }}
            />
          )}
        />
        <Route path={upvotesLink} render={() => null} />
        <Route path={downvotesLink} render={() => null} />

        <Route render={() => <Redirect to={commentsLink} />} />
      </Switch>
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    userSelector,
    createDocSelector({
      collection: 'users',
      id: 'targetUsername',
      prop: 'userDoc',
    }),
  ],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(Profile);
