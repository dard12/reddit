import React from 'react';
import { connect } from 'react-redux';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import UserLink from '../../components/UserLink/UserLink';

interface UserNameProps {
  user: string;
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

  const { first_name, last_name, user_name } = userDoc;
  let displayName;

  if (first_name && last_name) {
    displayName = `${first_name} ${_.first(last_name)}.`;
  } else if (first_name) {
    displayName = first_name;
  } else {
    displayName = user_name;
  }

  return plainName ? (
    <React.Fragment>{displayName}</React.Fragment>
  ) : (
    <UserLink user_name={user_name} displayName={displayName} />
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
