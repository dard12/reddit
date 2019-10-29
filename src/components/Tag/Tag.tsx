import React from 'react';
import styles from './Tag.module.scss';
import { setQueryParams } from '../../history';

interface TagProps {
  tag: string;
}

function Tag(props: TagProps) {
  const { tag } = props;
  const onClick = () => {
    setQueryParams({ tag });
  };

  return (
    <div className={styles.tag} onClick={onClick}>
      {tag}
    </div>
  );
}

export default Tag;
