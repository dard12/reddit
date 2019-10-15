import React from 'react';
import classNames from 'classnames';
import styles from './Tag.module.scss';

interface TagProps {
  tag: string;
}

export default function Tag(props: TagProps) {
  const { tag } = props;
  const tagToProps: any = {
    all: { label: 'All' },
    coordination: { label: 'Coordination' },
    technical: { label: 'Technical' },
    process: { label: 'Process' },
    motivation: { label: 'Motivation' },
    fun: { label: 'Fun' },
  };

  if (!tag || !tagToProps[tag]) {
    return null;
  }

  const { label } = tagToProps[tag];

  return <div className={classNames(styles.tagChip, styles[tag])}>{label}</div>;
}
