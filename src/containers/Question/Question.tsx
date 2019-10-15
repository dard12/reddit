import React from 'react';
import styles from './Question.module.scss';
import QuestionVote from '../../containers/QuestionVote/QuestionVote';

interface QuestionProps {
  questionDoc?: any;
}

function Question(props: QuestionProps) {
  const { questionDoc } = props;
  const { question, description } = questionDoc;

  return (
    <div className={styles.item}>
      <QuestionVote />

      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span>{question}</span>
        </div>
        <div className={styles.itemDescription}>{description}</div>
        <div className={styles.itemActions}>
          <span className={styles.itemComment}>17 comments</span>
          <span>2 hours ago</span>
        </div>
      </div>
    </div>
  );
}

export default Question;
