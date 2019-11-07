import React from 'react';
import _ from 'lodash';
import { setQueryParams } from '../../history';
import styles from './Tabs.module.scss';
import { IoIosArrowDown } from 'react-icons/io';

interface TabsProps {
  tabs: { label: string; value: string }[];
  defaultTab: string;
  queryParamName: string;
  currentTab?: string;
  seeMore?: boolean;
}

function Tabs(props: TabsProps) {
  const { tabs, currentTab, defaultTab, queryParamName, seeMore } = props;
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
      {seeMore && (
        <div className={styles.seeMore}>
          See More
          <IoIosArrowDown />
        </div>
      )}
    </div>
  );
}

export default Tabs;
