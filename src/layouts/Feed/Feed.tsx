import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Feed.module.scss';
import Question from '../../containers/Question/Question';
import SearchBar from '../../containers/SearchBar/SearchBar';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';

interface FeedProps {}

function Feed(props: FeedProps) {
  const { result } = useAxiosGet('/api/question');

  useLoadDocs({ collection: 'question', result, loadDocsAction });

  if (!result) {
    return null;
  }

  const docs = result.docs;

  return (
    <div className={styles.feedPage}>
      <SearchBar />

      <div className="tabs">
        <div className="active">
          <span>All</span>
        </div>
        <div>
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

      {_.map(docs, ({ id }) => (
        <Link to="/question" key={id}>
          <Question question={id} />
        </Link>
      ))}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(Feed);
