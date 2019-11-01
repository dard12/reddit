import React from 'react';
import { connect } from 'react-redux';
import { differenceInDays } from 'date-fns';
import { UserDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

interface WithReputationProps {
  user: string;
  render: Function;
  userDoc?: UserDoc;
  loadDocsAction?: Function;
}

function WithReputation(props: WithReputationProps) {
  const { user, render, userDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/user',
    { id: user },
    { cachedResult: userDoc, name: 'WithReputation' },
  );

  useLoadDocs({ collection: 'users', result, loadDocsAction });

  if (!userDoc) {
    return null;
  }

  const { created_at } = userDoc;
  const daysSinceSignup = differenceInDays(new Date(), created_at);

  return <React.Fragment>{render(daysSinceSignup > 3)}</React.Fragment>;
}

export default connect(
  createDocSelector({
    collection: 'users',
    id: 'user',
    prop: 'userDoc',
  }),
  { loadDocsAction },
)(WithReputation);
