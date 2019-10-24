import React from 'react';
import { connect } from 'react-redux';
import styles from './FullComment.module.scss';
import { CommentDoc, QuestionDoc } from '../../../src-server/models';
import { loadDocsAction } from '../../redux/actions';
import { createDocSelector } from '../../redux/selectors';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import Skeleton from '../../components/Skeleton/Skeleton';
import Question from '../Question/Question';
import Comment from '../../containers/Comment/Comment';

interface FullCommentProps {
  commentDoc: CommentDoc;
  question: string;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function FullComment(props: FullCommentProps) {
  const { commentDoc, question, questionDoc, loadDocsAction } = props;
  const { id: comment, parent_id, type } = commentDoc;
  const { result } = useAxiosGet(
    '/api/question',
    { id: question },
    { name: 'FullComment', cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!questionDoc) {
    return <Skeleton count={3} />;
  }

  return (
    <div>
      <Question question={question} />

      <div className={styles.recentComments}>
        <div className={styles.recentTitle}>Recent Posts</div>

        {parent_id ? (
          <Comment
            question={question}
            comment={parent_id}
            key={parent_id}
            depth={3}
            type={type}
            showLink
          />
        ) : (
          <Comment
            question={question}
            comment={comment}
            key={comment}
            depth={0}
            type={type}
            showLink
          />
        )}
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'questions',
    id: 'question',
    prop: 'questionDoc',
  }),
  { loadDocsAction },
)(FullComment);
