import React, { useState } from 'react';
import _ from 'lodash';
import styles from './Paging.module.scss';

interface PagingProps {
  params: any;
  PageComponent: any;
  className?: string;
}

function Paging(props: PagingProps) {
  const { params, PageComponent, className = styles.pageGrid } = props;
  const [page, setPage] = useState(0);

  return (
    <div className={className}>
      {_.map(_.range(page + 1), currPage => (
        <PageComponent
          key={currPage}
          params={{ ...params, page: currPage }}
          seeMore={currPage === page ? () => setPage(page + 1) : undefined}
        />
      ))}
    </div>
  );
}

export default Paging;
