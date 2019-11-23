import React from 'react';
import styles from './RecentQuestions.module.scss';
import Paging from '../../containers/Paging/Paging';
import FullQuestionListPage from '../../containers/FullQuestionListPage/FullQuestionListPage';

interface RecentQuestionsProps {
  pageSize?: number;
}

function RecentQuestions(props: RecentQuestionsProps) {
  const { pageSize = 7 } = props;

  return (
    <div className={styles.recent}>
      <Paging
        component={FullQuestionListPage}
        params={{ sort: 'recent', pageSize }}
      />
    </div>
  );
}

export default RecentQuestions;
