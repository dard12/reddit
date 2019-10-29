import React from 'react';
import qs from 'qs';
import styles from './Tag.module.scss';
import history, { getQueryParams } from '../../history';

interface TagProps {
  tag: string;
}

function Tag(props: TagProps) {
  const { tag } = props;
  const onClick = () => {
    const queryParams = getQueryParams();
    queryParams.tag = tag;
    const search = qs.stringify(queryParams);
    history.push({ pathname: '/question', search });
  };

  return (
    <div className={styles.tag} onClick={onClick}>
      {tag}
    </div>
  );
}

export default Tag;
