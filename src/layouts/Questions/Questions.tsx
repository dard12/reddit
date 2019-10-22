import React from 'react';
import styles from './Questions.module.scss';
import SearchBar from '../../containers/SearchBar/SearchBar';
import QuestionList from '../../containers/QuestionList/QuestionList';
import { getQueryParams } from '../../history';
import Tabs from '../../containers/Tabs/Tabs';

interface QuestionsProps {}

function Questions(props: QuestionsProps) {
  const query = getQueryParams('query');
  const tag = getQueryParams('tag');
  const params = {
    search: { text: query, tags: [tag] },
    sort: 'up_vote',
  };

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Technical Skill', value: 'technical' },
    { label: 'Team Fit', value: 'fit' },
    { label: 'Personal Motivation', value: 'motivation' },
    { label: 'Fun / Other', value: 'fun' },
  ];

  return (
    <div className={styles.questionsPage}>
      <SearchBar query={getQueryParams('query')} />
      <Tabs tabs={tabs} queryParamName="tag" initialTab="all" />
      <QuestionList params={params} />
    </div>
  );
}

export default Questions;
