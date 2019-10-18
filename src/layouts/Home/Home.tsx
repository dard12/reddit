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
import Skeleton from '../../components/Skeleton/Skeleton';

interface HomeProps {
  loadDocsAction?: Function;
}

function Home(props: HomeProps) {
  const { loadDocsAction } = props;
  const query = getQueryParams('query');
  const tag = getQueryParams('tag');
  const { result, isReady } = useAxiosGet(
    '/api/question',
    {
      search: {
        text: query,
        tags: [tag],
      },
      sort: 'up_vote',
    },
    { reloadOnChange: true },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  const docs = _.get(result, 'docs');

  return (
    <div className={styles.homePage}>
      <SearchBar />
      <HomeTabs />

      {isReady ? (
        _.map(docs, ({ id }) => <Question question={id} key={id} />)
      ) : (
        <React.Fragment>
          {_.times(5, index => (
            <Skeleton key={index} count={4} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
}

export default connect(
  null,
  { loadDocsAction },
)(Home);
