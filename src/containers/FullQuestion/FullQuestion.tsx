import React from 'react';
import { connect } from 'react-redux';
import styles from './FullQuestion.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import Question from '../Question/Question';
import Comment from '../Comment/Comment';

interface FullQuestionProps {
  question: string;
  comment?: string;
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function FullQuestion(props: FullQuestionProps) {
  const { question, comment, commentDoc, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/comment',
    { id: comment },
    { name: 'FullQuestion', cachedResult: commentDoc },
  );

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

  if (!isSuccess) {
    return <Skeleton count={3} />;
  }

  return (
    <div>
      <Question question={question} />

      <div className={styles.recent}>
        <div className={styles.recentTitle}>Recent Post</div>

        {comment && commentDoc && (
          <Comment
            question={question}
            comment={comment}
            key={comment}
            depth={commentDoc.parent_id === comment ? 0 : 1}
            type={commentDoc.type}
            showLink
          />
        )}
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'comments',
    id: 'comment',
    prop: 'commentDoc',
  }),
  { loadDocsAction },
)(FullQuestion);
