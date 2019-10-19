import React, { useState } from 'react';
import _ from 'lodash';
import { getQueryParams } from '../../history';
import QuestionListPage from '../QuestionListPage/QuestionListPage';

interface QuestionListProps {}

function QuestionList(props: QuestionListProps) {
  const [page, setPage] = useState(0);
  const query = getQueryParams('query');
  const tag = getQueryParams('tag');

  const params = {
    search: { text: query, tags: [tag] },
    sort: 'up_vote',
  };

  return (
    <React.Fragment>
      {_.map(_.range(page + 1), currPage => (
        <QuestionListPage
          key={currPage}
          params={{ ...params, page: currPage }}
          seeMore={currPage === page ? () => setPage(page + 1) : undefined}
        />
      ))}
    </React.Fragment>
  );
}

export default QuestionList;
