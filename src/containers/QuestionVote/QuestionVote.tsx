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
    { name: 'QuestionVote', cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  const up_vote = _.get(questionDoc, 'up_vote') || 0;
  const down_vote = _.get(questionDoc, 'down_vote') || 0;
  const score = up_vote - down_vote + myVote;
  const scoreDisplay =
    Math.abs(score) > 999 ? `${_.round(score / 1000, 1)}k` : score;
  const upVote = () => setMyVote(1);
  const downVote = () => setMyVote(-1);

  return (
    <div className={styles.vote}>
      <IoIosArrowUp onClick={upVote} />
      <span>{questionDoc && scoreDisplay}</span>
      <IoIosArrowDown onClick={downVote} />
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
)(QuestionVote);
