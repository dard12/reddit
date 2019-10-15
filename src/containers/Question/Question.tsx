import React from 'react';
import styles from './Question.module.scss';
import QuestionVote from '../../containers/QuestionVote/QuestionVote';
import { QuestionDoc } from '../../../src-server/models';

interface QuestionProps {
  questionDoc?: QuestionDoc;
}

function Question(props: QuestionProps) {
  const { questionDoc } = props;

  if (!questionDoc) {
    return null;
  }

  const { title, description } = questionDoc;

  return (
    <div className={styles.item}>
      <QuestionVote />

      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span>{title}</span>
        </div>
        <div className={styles.itemDescription}>{description}</div>
        <div className={styles.itemActions}>
          <span className={styles.itemMeta}>17 responses</span>
          <span>•</span>
          <span className={styles.itemMeta}>3 meta-comments</span>
        </div>
      </div>
    </div>
  );
}

export default Question;
