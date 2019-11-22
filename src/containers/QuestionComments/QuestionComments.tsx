import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createSelector } from 'redux-starter-kit';
import Comment, { getSortedComments } from '../../containers/Comment/Comment';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import { CommentDoc } from '../../../src-server/models';
import Skeleton from '../../components/Skeleton/Skeleton';
import { createTreeChildSelector, userSelector } from '../../redux/selectors';
import styles from './QuestionComments.module.scss';

interface QuestionCommentsProps {
  question: string;
  type: 'response' | 'meta';
  user?: string;
  childrenComments?: CommentDoc[];
  loadDocsAction?: Function;
}

function QuestionComments(props: QuestionCommentsProps) {
  const { question, type, user, childrenComments, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/comment',
    { question_id: question, type, pageSize: 1000 },
    { reloadOnChange: true, name: 'QuestionComments' },
  );

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={4} />;
  }

  const sortedComments = getSortedComments(user, childrenComments);

  return (
    <div className={styles.commentSection}>
      {_.isEmpty(sortedComments) ? (
        <div className="card faded">No comments yet.</div>
      ) : (
        _.map(sortedComments, ({ id }) => (
          <div className={styles.rootComment}>
            <Comment
              question={question}
              type={type}
              comment={id}
              depth={0}
              key={id}
            />
          </div>
        ))
      )}
    </div>
  );
}

const mapStateToProps = createSelector(
  [createTreeChildSelector(), userSelector],
  (a, b) => ({ ...a, ...b }),
);

export default connect(
  mapStateToProps,
  { loadDocsAction },
)(QuestionComments);
