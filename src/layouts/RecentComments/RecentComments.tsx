import React from 'react';
import styles from './RecentComments.module.scss';
import SearchBar from '../../containers/SearchBar/SearchBar';
import { getQueryParams } from '../../history';
import Tabs from '../../containers/Tabs/Tabs';
import CommentList from '../../containers/CommentList/CommentList';

interface RecentCommentsProps {}

function RecentComments(props: RecentCommentsProps) {
  // const tag = getQueryParams('tag');
  const params = {
    // search: { tags: [tag] },
  };

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Technical Skill', value: 'technical' },
    { label: 'Team Fit', value: 'fit' },
    { label: 'Personal Motivation', value: 'motivation' },
    { label: 'Fun / Other', value: 'fun' },
  ];

  return (
    <div className={styles.recentComments}>
      <SearchBar query={getQueryParams('query')} />
      <Tabs tabs={tabs} queryParamName="tag" initialTab="all" />
      <CommentList params={params} />
    </div>
  );
}

export default RecentComments;
