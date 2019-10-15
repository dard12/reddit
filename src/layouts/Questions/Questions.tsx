import React from 'react';
import _ from 'lodash';
import styles from './Questions.module.scss';
import QuestionBank from '../../containers/QuestionBank/QuestionBank';

interface QuestionsProps {}

export default function Questions(props: QuestionsProps) {
  return (
    <React.Fragment>
      <div className={styles.questionHeader}>Interview Questions</div>
      <div className={styles.questionDescription}>
        This is a list of the questions asked in CoverStory interviews. Feel
        free to use this list as a resource — look through questions in each
        category to prepare responses for your job hunt.
      </div>
      <QuestionBank />
    </React.Fragment>
  );
}
