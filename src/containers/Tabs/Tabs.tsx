import React from 'react';
import _ from 'lodash';
import { setQueryParams } from '../../history';

interface TabsProps {
  tabs: { label: string; value: string }[];
  defaultTab: string;
  queryParamName: string;
  currentTab?: string;
}

function Tabs(props: TabsProps) {
  const { tabs, currentTab, defaultTab, queryParamName } = props;
  const createOnClick = (value: string) => () => {
    setQueryParams({ [queryParamName]: value });
  };

  if (!currentTab) {
    const clickDefault = createOnClick(defaultTab);
    clickDefault();
  }

  return (
    <div className="tabs">
      {_.map(tabs, ({ label, value }) => (
        <div
          onClick={createOnClick(value)}
          className={currentTab === value ? 'active' : undefined}
          key={value}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
