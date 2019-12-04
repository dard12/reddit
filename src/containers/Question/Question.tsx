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
import Tag from '../Tag/Tag';
import { IoMdChatboxes, IoMdChatbubbles } from 'react-icons/io';

interface QuestionProps {
  question: string;
  disableActions?: boolean;
  className?: string;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function Question(props: QuestionProps) {
  const {
    question,
    disableActions,
    className = styles.item,
    questionDoc,
    loadDocsAction,
  } = props;

  const { result, isSuccess } = useAxiosGet(
    '/api/question',
    { id: question },
    { cachedResult: questionDoc, name: 'Question', reloadOnChange: true },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!questionDoc || !isSuccess) {
    return <Skeleton card count={4} />;
  }

  const { description, response_count, tags, updated_at } = questionDoc;
  const questionResponseLink = `/question/${question}?type=response`;

  return (
    <div className={className}>
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

        <div className={styles.itemActions}>
          {!disableActions && (
            <Link to={questionResponseLink} className={styles.itemMeta}>
              <IoMdChatbubbles /> {response_count} comments
            </Link>
          )}
        </div>
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
