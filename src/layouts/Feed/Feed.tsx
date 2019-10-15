import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { getQuestions } from '../../hardcoded';
import styles from './Feed.module.scss';
import Question from '../../containers/Question/Question';

interface FeedProps {}

function Feed(props: FeedProps) {
  const docs = getQuestions();

  return (
    <div className={styles.feedPage}>
      <div className={styles.feedTabs}>
        <div className={styles.feedTabActive}>Technical Skill</div>
        <div>Team Fit</div>
        <div>Personal Motivation</div>
        <div>Fun / Other</div>
      </div>

      {_.map(docs, questionDoc => (
        <Link to="/question" key={questionDoc.id}>
          <Question questionDoc={questionDoc} />
        </Link>
      ))}
    </div>
  );
}

export default Feed;
