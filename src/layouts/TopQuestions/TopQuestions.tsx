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
  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Motivation', value: 'motivation' },
    { label: 'Team Fit', value: 'fit' },
    { label: 'Tech', value: 'technical' },
    { label: 'Security', value: 'security' },
    { label: 'Dev Ops', value: 'devops' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Design', value: 'design' },
    { label: 'Management', value: 'management' },
    { label: 'Support', value: 'support' },
    { label: 'Fun', value: 'fun' },
  ];

  return (
    <div className={styles.topQuestions}>
      <SearchBar query={query} />
      <Tabs tabs={tabs} initialTab="all" queryParamName="tag" />
      <Paging component={QuestionListPage} params={params} />
    </div>
  );
}

export default Questions;
