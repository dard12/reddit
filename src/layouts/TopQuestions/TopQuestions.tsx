import React from 'react';
import styles from './TopQuestions.module.scss';
import SearchBar from '../../containers/SearchBar/SearchBar';
import { getQueryParams } from '../../history';
import Paging from '../../containers/Paging/Paging';
import QuestionListPage from '../../containers/QuestionListPage/QuestionListPage';
import Tabs from '../../containers/Tabs/Tabs';

interface QuestionsProps {}

function Questions(props: QuestionsProps) {
  const query = getQueryParams('query');
  const tag = getQueryParams('tag');
  const params = {
    search: { text: query, tags: [tag] },
    sort: 'up_votes',
  };
  const tabs = [{ label: 'All', value: 'all' }];

  return (
    <div className={styles.topQuestions}>
      <SearchBar query={query} />
      <Tabs tabs={tabs} initialTab="all" queryParamName="tag" />
      <Paging component={QuestionListPage} params={params} />
    </div>
  );
}

export default Questions;
