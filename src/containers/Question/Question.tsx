import React from 'react';
import { connect } from 'react-redux';
import styles from './Question.module.scss';
import QuestionVote from '../../containers/QuestionVote/QuestionVote';
import { QuestionDoc } from '../../../src-server/models';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { Link } from 'react-router-dom';

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

  const { title, description, meta_count, response_count } = questionDoc;
  const questionLink = `/question/${question}`;

  return (
    <div className={styles.item}>
      <QuestionVote />

      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span>{title}</span>
        </div>
        <div className={styles.itemDescription}>{description}</div>
        <div className={styles.itemActions}>
          <Link to={`${questionLink}/responses`} className={styles.itemMeta}>
            {response_count} responses
          </Link>

          <span>•</span>

          <Link to={`${questionLink}/meta`} className={styles.itemMeta}>
            {meta_count} meta-comments
          </Link>
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
