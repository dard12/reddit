import React from 'react';
import { Redirect } from 'react-router';
import _ from 'lodash';
import styles from './Profile.module.scss';
import VideoList from '../../containers/VideoList/VideoList';
import VideoNav from '../../containers/VideoNav/VideoNav';
import ProfileCard from '../../containers/ProfileCard/ProfileCard';

interface ProfileProps {
  user: string;
}

export default function Profile(props: ProfileProps) {
  const { user } = props;
  const validUsers = [
    'lihsing-lung',
    'michael-duplessis',
    'tito-mbagwu',
    'coverstory',
  ];

  if (!_.includes(validUsers, user)) {
    return <Redirect to="/profile/lihsing-lung" />;
  }

  return (
    <div className={styles.profilePage}>
      <ProfileCard user={user} />
      <VideoList user={user} />
      <VideoNav user={user} />
    </div>
  );
}
