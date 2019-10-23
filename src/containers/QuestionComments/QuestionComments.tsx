import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import { createTreeChildSelector } from '../../redux/selectors';

interface QuestionCommentsProps {
  question: number;
  type: 'response' | 'meta';
  childrenComments?: CommentDoc[];
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, childrenComments, type, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/comment',
    { question_id: question, type },
    { reloadOnChange: true, name: 'QuestionComments' },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  return (
    <div>
      {_.isEmpty(childrenComments) ? (
        <div className="card">No comments yet.</div>
      ) : (
        _.map(childrenComments, ({ id }) => (
          <Comment
            question={question}
            type={type}
            comment={id}
            depth={0}
            key={id}
          />
        ))
      )}
    </div>
  );
}

export default connect(
  createTreeChildSelector(),
  { loadDocsAction },
)(QuestionComments);
