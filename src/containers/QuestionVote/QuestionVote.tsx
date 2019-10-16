import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './QuestionVote.module.scss';
import { QuestionDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

interface QuestionVoteProps {
  question: number;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function QuestionVote(props: QuestionVoteProps) {
  const { question, questionDoc, loadDocsAction } = props;
  const [myVote, setMyVote] = useState(0);
  const { result } = useAxiosGet(
    '/api/question',
    { id: question },
    { cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'question', result, loadDocsAction });

  const vote = _.get(questionDoc, 'vote');
  const upVote = () => setMyVote(1);
  const downVote = () => setMyVote(-1);

  return (
    <div className={styles.vote}>
      <IoIosArrowUp onClick={upVote} />
      <span>{vote && vote + myVote}</span>
      <IoIosArrowDown onClick={downVote} />
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
)(QuestionVote);
