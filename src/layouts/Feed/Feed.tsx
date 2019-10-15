import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { getQuestions } from '../../hardcoded';
import styles from './Feed.module.scss';
import Question from '../../containers/Question/Question';
import SearchBar from '../../containers/SearchBar/SearchBar';

interface FeedProps {}

function Feed(props: FeedProps) {
  const docs = getQuestions();

  return (
    <div className={styles.feedPage}>
      <div>
        <SearchBar />

        <div className="tabs">
          <div className="active">
            <span>Technical Skill</span>
          </div>
          <div>
            <span>Team Fit</span>
          </div>
          <div>
            <span>Personal Motivation</span>
          </div>
          <div>
            <span>Fun / Other</span>
          </div>
        </div>
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
