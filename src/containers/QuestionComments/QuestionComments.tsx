import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Comment from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import { createDocListSelector } from '../../redux/selectors';

interface QuestionCommentsProps {
  question: number;
  type: 'response' | 'meta';
  questionCommentsFilter: any;
  questionComments?: CommentDoc[];
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, questionComments, type, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet('/api/comment', {
    question_id: question,
    type,
  });

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  return (
    <div>
      {_.map(questionComments, ({ id }) => (
        <Comment
          comment={id}
          childrenFilter={(commentDoc: CommentDoc) =>
            commentDoc.parent_id === id && commentDoc.id !== id
          }
          key={id}
        />
      ))}
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'comments',
    filter: 'questionCommentsFilter',
    prop: 'questionComments',
  }),
  { loadDocsAction },
)(QuestionComments);
