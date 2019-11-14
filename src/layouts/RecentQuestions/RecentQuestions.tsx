import React from 'react';
import styles from './RecentQuestions.module.scss';
import Paging from '../../containers/Paging/Paging';
import FullQuestionListPage from '../../containers/FullQuestionListPage/FullQuestionListPage';

interface RecentQuestionsProps {}

function RecentQuestions(props: RecentQuestionsProps) {
  return (
    <div className={styles.recent}>
      <Paging
        component={FullQuestionListPage}
        params={{ sort: 'recent', pageSize: 10 }}
      />
    </div>
  );
}

export default RecentQuestions;
