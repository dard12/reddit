import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';

interface UserNameProps {
  user: number;
  userDoc?: UserDoc;
  loadDocsAction?: Function;
  plainName?: boolean;
}

function UserName(props: UserNameProps) {
  const { user, userDoc, loadDocsAction, plainName } = props;
  const { result } = useAxiosGet(
    '/api/user',
    { id: user },
    { cachedResult: userDoc },
  );

  useLoadDocs({ collection: 'user', result, loadDocsAction });

  if (!userDoc) {
    return <Skeleton inline />;
  }

  const { username } = userDoc;

  return plainName ? (
    <React.Fragment>{username}</React.Fragment>
  ) : (
    <Link className="hoverLink" to={`/profile/${username}`}>
      {username}
    </Link>
  );
}

export default connect(
  createDocSelector({
    collection: 'user',
    id: 'user',
    prop: 'userDoc',
  }),
  { loadDocsAction },
)(UserName);
