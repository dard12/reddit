import React from 'react';
import { connect } from 'react-redux';
import styles from './FullQuestion.module.scss';
import { CommentDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Question from '../Question/Question';
import Comment from '../Comment/Comment';
import Skeleton from '../../components/Skeleton/Skeleton';

interface FullQuestionProps {
  question: string;
  comment?: string;
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

  useLoadDocs({ collection: 'comments', result, loadDocsAction });

  return (
    <div className={styles.fullContainer}>
      <Question question={question} className={styles.question} />

      {comment &&
        (commentDoc ? (
          <div className={styles.comment}>
            <Comment
              question={question}
              comment={comment}
              key={comment}
              depth={commentDoc.is_answer ? 0 : 1}
              type={commentDoc.type}
              showLink
            />
          </div>
        ) : (
          <Skeleton card count={3} />
        ))}
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
