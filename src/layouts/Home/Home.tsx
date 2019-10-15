import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Feed.module.scss';
import Question from '../../containers/Question/Question';
import SearchBar from '../../containers/SearchBar/SearchBar';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import HomeTabs from '../../containers/HomeTabs/HomeTabs';

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
      <HomeTabs />

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
