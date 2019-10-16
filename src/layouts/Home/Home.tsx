import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './Home.module.scss';
import Question from '../../containers/Question/Question';
import SearchBar from '../../containers/SearchBar/SearchBar';
import { useAxiosGet, useLoadDocs } from '../../hooks/useAxios';
import { loadDocsAction } from '../../redux/actions';
import HomeTabs from '../../containers/HomeTabs/HomeTabs';
import { getQueryParams } from '../../history';

interface HomeProps {
  loadDocsAction?: Function;
}

function Home(props: HomeProps) {
  const { loadDocsAction } = props;
  const query = getQueryParams('query');
  const tag = getQueryParams('tag');

  const { result } = useAxiosGet('/api/question', {
    search: {
      text: query,
      tags: [tag],
    },
  });

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  if (!result) {
    return null;
  }

  const docs = result.docs;

  return (
    <div className={styles.homePage}>
      <SearchBar />
      <HomeTabs />

      {_.map(docs, ({ id }) => (
        <Question question={id} key={id} />
      ))}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(Home);
