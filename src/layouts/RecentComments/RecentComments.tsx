import React from 'react';
import styles from './RecentComments.module.scss';
import Tabs from '../../containers/Tabs/Tabs';
import Paging from '../../containers/Paging/Paging';
import FullCommentListPage from '../../containers/FullCommentListPage/FullCommentListPage';

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
      <Tabs tabs={tabs} queryParamName="tag" initialTab="all" />
      <Paging PageComponent={FullCommentListPage} params={params} />
    </div>
  );
}

export default RecentComments;
