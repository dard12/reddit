import React from 'react';
import styles from './Home.module.scss';
import SearchBar from '../../containers/SearchBar/SearchBar';
import HomeTabs from '../../containers/HomeTabs/HomeTabs';
import QuestionList from '../../containers/QuestionList/QuestionList';
import { getQueryParams } from '../../history';

interface HomeProps {}

function Home(props: HomeProps) {
  return (
    <div className={styles.homePage}>
      <SearchBar query={getQueryParams('query')} />
      <HomeTabs />
      <QuestionList />
    </div>
  );
}

export default Home;
