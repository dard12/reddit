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
import CommentList from '../../containers/CommentList/CommentList';

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
            <div>Joined October 2019</div>
          </div>

          <div className={styles.reputation}>
            <div>
              <b>Reputation</b>
            </div>
            <span className={styles.reputationPoints}>23 points</span>
          </div>
        </div>

        <div className="tabs">
          <NavLink to={commentsLink} activeClassName="active">
            Comments (23)
          </NavLink>
          <NavLink to={questionsLink} activeClassName="active">
            Questions (4)
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
          path={commentsLink}
          render={() => <CommentList params={{ author_id: targetUser }} />}
        />
        <Route path={questionsLink} render={() => null} />
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
