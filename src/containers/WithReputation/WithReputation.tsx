import React from 'react';
import { connect } from 'react-redux';
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

  const { reputation } = userDoc;

  return <React.Fragment>{render(reputation > 5)}</React.Fragment>;
}

export default connect(
  createDocSelector({
    collection: 'users',
    id: 'user',
    prop: 'userDoc',
  }),
  { loadDocsAction },
)(WithReputation);
