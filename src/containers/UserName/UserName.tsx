import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import UserLink from '../../components/UserLink/UserLink';

interface UserNameProps {
  user: number;
  userDoc?: UserDoc;
  loadDocsAction?: Function;
  plainName?: boolean;
}

function UserName(props: UserNameProps) {
  const { user, userDoc, loadDocsAction, plainName } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/user',
    { id: user },
    { name: 'UserName', cachedResult: userDoc },
  );

  useLoadDocs({ collection: 'users', result, loadDocsAction });

  if (!userDoc || !isSuccess) {
    return <Skeleton inline />;
  }

  const { user_name } = userDoc;

  return plainName ? (
    <React.Fragment>{user_name}</React.Fragment>
  ) : (
    <UserLink user_name={user_name} />
  );
}

export default connect(
  createDocSelector({
    collection: 'users',
    id: 'user',
    prop: 'userDoc',
  }),
  { loadDocsAction },
)(UserName);
