import React from 'react';
import styles from './RecentComments.module.scss';
import Paging from '../../containers/Paging/Paging';
import FullCommentListPage from '../../containers/FullQuestionListPage/FullQuestionListPage';

interface RecentCommentsProps {}

function RecentComments(props: RecentCommentsProps) {
  return (
    <div className={styles.recentComments}>
      <Paging
        component={FullCommentListPage}
        params={{ sort: ['updated_at', 'created_at'] }}
      />
    </div>
  );
}

export default RecentComments;
