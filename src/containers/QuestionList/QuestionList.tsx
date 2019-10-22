import React, { useState } from 'react';
import _ from 'lodash';
import QuestionListPage from '../QuestionListPage/QuestionListPage';
import styles from './QuestionList.module.scss';

interface QuestionListProps {
  params: any;
}

function QuestionList(props: QuestionListProps) {
  const { params } = props;
  const [page, setPage] = useState(0);

  return (
    <div className={styles.questionList}>
      {_.map(_.range(page + 1), currPage => (
        <QuestionListPage
          key={currPage}
          params={{ ...params, page: currPage }}
          seeMore={currPage === page ? () => setPage(page + 1) : undefined}
        />
      ))}
    </div>
  );
}

export default QuestionList;
