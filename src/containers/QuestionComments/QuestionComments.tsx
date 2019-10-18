import React from 'react';
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
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, type, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/comment',
    { question_id: question, type },
    { reloadOnChange: true },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!result) {
    return <Skeleton count={4} />;
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
