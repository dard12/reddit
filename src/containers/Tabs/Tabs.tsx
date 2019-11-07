import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { IoIosArrowDown } from 'react-icons/io';
import { setQueryParams } from '../../history';
import styles from './Tabs.module.scss';

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

  const viewableTabs = seeMore ? _.take(tabs, 10) : tabs;

  return (
    <div className={styles.tabsContainer}>
      <div className={classNames(styles.tabs, { [styles.hasMore]: seeMore })}>
        {_.map(viewableTabs, ({ label, value }) => (
          <div
            onClick={createOnClick(value)}
            className={currentTab === value ? styles.active : undefined}
            key={value}
          >
            {label}
          </div>
        ))}
      </div>

      {seeMore && (
        <div className={styles.seeMore}>
          <div className={styles.divider} />
          <span>
            more
            <IoIosArrowDown />
          </span>
        </div>
      )}
    </div>
  );
}

export default Tabs;
