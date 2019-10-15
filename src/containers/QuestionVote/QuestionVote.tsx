import React from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import styles from './QuestionVote.module.scss';

interface QuestionVoteProps {}

function QuestionVote(props: QuestionVoteProps) {
  return (
    <div className={styles.vote}>
      <IoIosArrowUp />
      <span>26</span>
      <IoIosArrowDown />
    </div>
  );
}

export default QuestionVote;
