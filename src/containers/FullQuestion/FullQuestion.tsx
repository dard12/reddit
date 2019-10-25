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
  comment: string;
  commentDoc?: CommentDoc;
  loadDocsAction?: Function;
}

function FullQuestion(props: FullQuestionProps) {
  const { question, comment, commentDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/comment',
    { id: comment },
    { name: 'FullQuestion', cachedResult: commentDoc },
  );

  useLoadDocs({ collection: 'comment', result, loadDocsAction });

  if (!commentDoc) {
    return <Skeleton count={3} />;
  }

  const { parent_id, type } = commentDoc as CommentDoc;

  return (
    <div>
      <Question question={question} />

      <div className={styles.recent}>
        <div className={styles.recentTitle}>Recent Post</div>

        <Comment
          question={question}
          comment={comment}
          key={comment}
          depth={parent_id === comment ? 0 : 1}
          type={type}
          showLink
        />
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
