import React from 'react';
import { connect } from 'react-redux';
import styles from './Question.module.scss';
import QuestionVote from '../../containers/QuestionVote/QuestionVote';
import { QuestionDoc } from '../../../src-server/models';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';

interface QuestionProps {
  question: number;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function Question(props: QuestionProps) {
  const { question, questionDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/question',
    { id: question },
    { cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'question', result, loadDocsAction });

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

export default connect(
  createDocSelector({
    collection: 'question',
    id: 'question',
    prop: 'questionDoc',
  }),
  { loadDocsAction },
)(Question);
