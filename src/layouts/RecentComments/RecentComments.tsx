import React from 'react';
import styles from './RecentComments.module.scss';
import Paging from '../../containers/Paging/Paging';
import FullCommentListPage from '../../containers/FullCommentListPage/FullCommentListPage';

interface RecentCommentsProps {}

function RecentComments(props: RecentCommentsProps) {
  return (
    <div className={styles.recentComments}>
      <Paging component={FullCommentListPage} params={{ groupBy: true }} />
    </div>
  );
}

export default RecentComments;
