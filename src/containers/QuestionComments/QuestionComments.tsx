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
  rootFilter: any;
  rootComments?: CommentDoc[];
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, rootComments, type, loadDocsAction } = props;
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
      {_.isEmpty(rootComments) ? (
        <div className="card">No comments yet.</div>
      ) : (
        _.map(rootComments, ({ id }) => (
          <Comment
            comment={id}
            depth={0}
            childrenFilter={(commentDoc: CommentDoc) =>
              commentDoc.parent_id === id && commentDoc.id !== id
            }
            key={id}
          />
        ))
      )}
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'comments',
    filter: 'rootFilter',
    prop: 'rootComments',
  }),
  { loadDocsAction },
)(QuestionComments);
