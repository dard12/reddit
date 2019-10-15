import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import styles from './ProfileCard.module.scss';
import { Button } from '../../components/Button/Button';
import { getUserDoc } from '../../hardcoded';
import { getQueryParams, setQueryParams } from '../../history';

interface ProfileCardProps {
  user: string;
}

export default function ProfileCard(props: ProfileCardProps) {
  const { user } = props;
  const userDoc = getUserDoc(user);

  if (!userDoc) {
    return null;
  }

  const edit = getQueryParams('edit');
  const { photo, username } = userDoc;

  const isBusiness = user === 'coverstory';
  const userInfo = isBusiness ? '1-10 Employees' : 'Software Engineer';
  const toggleEdit = () => setQueryParams({ edit: edit ? undefined : 'true' });
  const toggleColor = isBusiness ? 'primary' : undefined;

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHead}>
        <div className={styles.profilePicture}>
          {photo ? <img src={photo} alt="user" /> : _.first(username)}
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.profileName}>{username}</div>
          <div>{userInfo}</div>
          <div className="faded">New York City</div>
        </div>

        <div className={styles.profileLinks}>
          <Link to="/" className="hoverLink">
            email@demo.com
          </Link>
          <Link to="/" className="hoverLink">
            linkedin.com/in/demo
          </Link>
          <Link to="/" className="hoverLink">
            demo.com
          </Link>
        </div>

        <div className={styles.profileAction}>
          {isBusiness && <Button className="btn">See Job Page</Button>}

          <Button
            className="btn"
            onClick={toggleEdit}
            color={edit ? 'grey' : toggleColor}
          >
            {edit ? 'View Profile' : 'Edit Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}
