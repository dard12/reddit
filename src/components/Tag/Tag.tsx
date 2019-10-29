import React from 'react';
import styles from './Tag.module.scss';

interface TagProps {
  tag: string;
}

function Tag(props: TagProps) {
  const { tag } = props;

  return <div className={styles.tag}>{tag}</div>;
}

export default Tag;
