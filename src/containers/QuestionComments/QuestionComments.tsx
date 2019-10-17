import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';
import { getQueryParams } from '../../history';

interface QuestionCommentsProps {
  question: number;
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, loadDocsAction } = props;
  const type = getQueryParams('type');
  const { result } = useAxiosGet('/api/comment', {
    question_id: question,
    type,
  });

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!result) {
    return null;
  }

  const docs: CommentDoc[] = result.docs;
  const rootComments = _.filter(docs, ({ id, parent_id }) => id === parent_id);

  return (
    <div>
      {_.map(rootComments, ({ id }) => (
        <Comment comment={id} allComments={docs} key={id} />
      ))}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(QuestionComments);
