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

interface ProfileProps {
  user?: string;
  userDoc?: UserDoc;
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
  const reviewsLink = `/profile/${targetUsername}`;

  return (
    <div className={styles.profilePage}>
      <div>
        <div className={styles.profileCard}>
          <UserName user={targetUser} />
        </div>

        <div className="tabs">
          <NavLink to={reviewsLink} activeClassName="active">
            Latest Reviews
          </NavLink>
          <NavLink to={reviewsLink} activeClassName="active">
            Favorite Songs
          </NavLink>
        </div>
      </div>

      <Switch>
        <Route path={reviewsLink} render={() => null} />
        <Route render={() => <Redirect to={reviewsLink} />} />
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
