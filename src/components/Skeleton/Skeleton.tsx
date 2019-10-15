import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  count?: number;
  card?: boolean;
  inline?: boolean;
}

function Skeleton(props: SkeletonProps) {
  const { count = 1, card = false, inline = false } = props;

  if (inline) {
    return <span> ... </span>;
  }

  return (
    <div className={classNames(styles.skeleton, { card })}>
      {_.map(Array(count).fill(null), (value, index) => (
        <div className={classNames(styles.line)} key={index} />
      ))}
    </div>
  );
}

export default Skeleton;
