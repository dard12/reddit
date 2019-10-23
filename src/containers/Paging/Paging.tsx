import React, { useState } from 'react';
import _ from 'lodash';
import styles from './Paging.module.scss';
import { getQueryParams, setQueryParams } from '../../history';

interface PagingProps {
  params: any;
  PageComponent: any;
  className?: string;
}

function Paging(props: PagingProps) {
  const { params = {}, PageComponent, className = styles.pageGrid } = props;
  const initialPage = _.toNumber(getQueryParams('page')) || 0;
  const [page, setPage] = useState(initialPage);

  const seeMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setQueryParams({ page: nextPage });
  };

  return (
    <div className={className}>
      {_.map(_.range(page + 1), currPage => (
        <PageComponent
          key={currPage}
          params={{ ...params, page: currPage }}
          seeMore={currPage === page ? seeMore : undefined}
        />
      ))}
    </div>
  );
}

export default Paging;
