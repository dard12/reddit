import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import styles from './Question.module.scss';
import QuestionVote from '../../containers/QuestionVote/QuestionVote';
import { QuestionDoc } from '../../../src-server/models';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import Skeleton from '../../components/Skeleton/Skeleton';
import QuestionName from '../QuestionName/QuestionName';
import Highlight from '../Highlight/Highlight';
import Tag from '../../components/Tag/Tag';

interface QuestionProps {
  question: string;
  disableActions?: boolean;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function Question(props: QuestionProps) {
  const { question, disableActions, questionDoc, loadDocsAction } = props;
  const { result, isSuccess } = useAxiosGet(
    '/api/question',
    { id: question },
    { cachedResult: questionDoc, name: 'Question' },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!questionDoc || !isSuccess) {
    return <Skeleton card count={4} />;
  }

  const { description, meta_count, response_count, tags } = questionDoc;
  const questionResponseLink = `/question/${question}?type=response`;
  const questionMetaLink = `/question/${question}?type=meta`;

  return (
    <div className={styles.item}>
      <QuestionVote question={question} questionDoc={questionDoc} />

      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <QuestionName question={question} />
        </div>

        <div className={styles.itemDescription}>
          <Highlight textToHighlight={description} />
        </div>

        <div>
          {_.map(tags, tag => (
            <Tag tag={tag} key={tag} />
          ))}
        </div>

        {!disableActions && (
          <div className={styles.itemActions}>
            <Link to={questionResponseLink} className={styles.itemMeta}>
              {response_count} responses
            </Link>

            <span>•</span>

            <Link to={questionMetaLink} className={styles.itemMeta}>
              {meta_count} meta-comments
            </Link>
          </div>
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
)(Question);
