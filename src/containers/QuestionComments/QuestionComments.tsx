import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';

interface QuestionCommentsProps {
  question: number;
  type: 'response' | 'meta';
  lastUpdate: Date;
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, type, lastUpdate, loadDocsAction } = props;
  const [lastLoad, setLastLoad] = useState(new Date());
  const params = { question_id: question, type };
  const { result, isSuccess, setParams } = useAxiosGet('/api/comment', params, {
    reloadOnChange: true,
    reloadCallback: () => setLastLoad(new Date()),
  });

  const hasUpdated = lastUpdate && lastUpdate > lastLoad;

  if (hasUpdated) {
    setParams(params);
    setLastLoad(new Date());
  }

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const docs: CommentDoc[] = result.docs;
  const rootComments = _.filter(docs, ({ id, parent_id }) => id === parent_id);

  return (
    <div>
      {_.map(rootComments, ({ id }) => (
        <Comment comment={id} childrenFilter={{ parent_id: id }} key={id} />
      ))}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(QuestionComments);
