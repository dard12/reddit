import React, { useState } from 'react';
import _ from 'lodash';
import { getQueryParams, setQueryParams } from '../../history';

interface TabsProps {
  tabs: { label: string; value: string }[];
  initialTab: string;
  queryParamName: string;
}

function Tabs(props: TabsProps) {
  const { tabs, initialTab, queryParamName } = props;
  const [tab, setTab] = useState(getQueryParams(queryParamName));

  const createOnClick = (value: string) => () => {
    setQueryParams({ [queryParamName]: value });
    setTab(value);
  };

  if (!tab) {
    const clickAll = createOnClick(initialTab);
    clickAll();
  }

  return (
    <div className="tabs">
      {_.map(tabs, ({ label, value }) => (
        <div
          onClick={createOnClick(value)}
          className={tab === value ? 'active' : undefined}
          key={value}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
