import React from 'react';
import _ from 'lodash';
import { setQueryParams } from '../../history';
import styles from './Tabs.module.scss';

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
    <div className={styles.tabs}>
      {_.map(tabs, ({ label, value }) => (
        <div
          onClick={createOnClick(value)}
          className={currentTab === value ? styles.active : undefined}
          key={value}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
