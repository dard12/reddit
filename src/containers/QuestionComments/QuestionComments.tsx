import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';

interface QuestionCommentsProps {
  question: number;
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, loadDocsAction } = props;
  const { result } = useAxiosGet('/api/comment', { question_id: question });

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

  if (!result) {
    return null;
  }

  const docs: CommentDoc[] = result.docs;
  const rootComments = _.reject(docs, 'parent_id');

  return (
    <div>
      {_.map(rootComments, commentDoc => (
        <Comment comment={commentDoc.id} allComments={docs} />
      ))}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(QuestionComments);
