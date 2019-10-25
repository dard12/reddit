import React from 'react';
import styles from './Questions.module.scss';
import SearchBar from '../../containers/SearchBar/SearchBar';
import { getQueryParams } from '../../history';
import Paging from '../../containers/Paging/Paging';
import QuestionListPage from '../../containers/QuestionListPage/QuestionListPage';

interface QuestionsProps {}

function Questions(props: QuestionsProps) {
  const query = getQueryParams('query');
  const params = {
    search: { text: query },
    sort: 'up_vote',
  };

  return (
    <div className={styles.questionsPage}>
      <SearchBar query={query} />
      <Paging component={QuestionListPage} params={params} />
    </div>
  );
}

export default Questions;
