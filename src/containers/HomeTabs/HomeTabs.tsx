import React, { useState } from 'react';
import _ from 'lodash';
import { getQueryParams, setQueryParams } from '../../history';

interface HomeTabsProps {}

function HomeTabs(props: HomeTabsProps) {
  const [tag, setTag] = useState(getQueryParams('tag'));

  const allTags = [
    { label: 'All', value: 'all' },
    { label: 'Technical Skill', value: 'technical' },
    { label: 'Team Fit', value: 'fit' },
    { label: 'Personal Motivation', value: 'motivation' },
    { label: 'Fun / Other', value: 'fun' },
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
    <div className="tabs">
      {_.map(allTags, ({ label, value }) => (
        <div
          onClick={createOnClick(value)}
          className={tag === value ? 'active' : undefined}
          key={value}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default HomeTabs;
