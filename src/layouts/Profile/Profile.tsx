import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import styles from './Profile.module.scss';
import { createDocSelector, userSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { UserDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';

interface ProfileProps {
  user?: number;
  userDoc?: UserDoc;
  targetUsername?: number;
  loadDocsAction?: Function;
}

function Profile(props: ProfileProps) {
  const { user, userDoc, targetUsername, loadDocsAction } = props;
  const params = { username: targetUsername };
  const { result } = useAxiosGet('/api/user', params, {
    name: 'Profile',
    reloadOnChange: true,
    cachedResult: userDoc,
  });

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!userDoc) {
    return (
      <div className={styles.profilePage}>
        <Skeleton card count={4} />
      </div>
    );
  }

  const targetUser = userDoc.id;
  const isMyProfile = user === targetUser;

  return (
    <div className={styles.profilePage}>
      <Switch>
        <Route path="/profile" render={() => null} />
        <Route render={() => <Redirect to="/profile" />} />
      </Switch>
    </div>
  );
}

const mapStateToProps = createSelector(
  [
    userSelector,
    createDocSelector({
      collection: 'user',
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
