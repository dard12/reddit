import React, { useState } from 'react';
import _ from 'lodash';
import styles from './QuestionTabs.module.scss';
import { getQueryParams, setQueryParams } from '../../history';

interface QuestionTabsProps {}

export default function QuestionTabs(props: QuestionTabsProps) {
  const [tag, setTag] = useState(getQueryParams('tag'));

  const allTags = [
    { label: 'All', value: 'all' },
    { label: 'Coordination', value: 'coordination' },
    { label: 'Technical', value: 'technical' },
    { label: 'Process', value: 'process' },
    { label: 'Motivation', value: 'motivation' },
    { label: 'Fun', value: 'fun' },
  ];

  const createOnClick = (tag: string) => () => {
    setQueryParams({ tag });
    setTag(tag);
  };

  if (!tag) {
    const clickAll = createOnClick('all');
    clickAll();
  }

  return (
    <div className={styles.questionTabs}>
      {_.map(allTags, ({ label, value }) => (
        <div
          onClick={createOnClick(value)}
          className={tag === value ? styles.active : undefined}
          key={value}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
