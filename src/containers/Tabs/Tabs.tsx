import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
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
  const [isMore, setIsMore] = useState(false);
  const createOnClick = (value: string) => () => {
    setQueryParams({ [queryParamName]: value });
  };
  const toggleIsMore = () => setIsMore(!isMore);

  if (!currentTab) {
    const clickDefault = createOnClick(defaultTab);
    clickDefault();
  }

  const mainTabs = seeMore ? _.take(tabs, 8) : tabs;
  const otherTabs = _.slice(tabs, 8, 33);

  return (
    <div>
      <div className={styles.tabsContainer}>
        <div className={classNames(styles.tabs, { [styles.hasMore]: seeMore })}>
          {_.map(mainTabs, ({ label, value }) => (
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
            <span onClick={toggleIsMore}>
              {isMore ? (
                <React.Fragment>
                  close <IoIosArrowUp />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  more <IoIosArrowDown />
                </React.Fragment>
              )}
            </span>
          </div>
        )}
      </div>

      {isMore && (
        <div className={styles.tabsMore}>
          {_.map(otherTabs, ({ label, value }) => (
            <div
              onClick={createOnClick(value)}
              className={currentTab === value ? styles.active : undefined}
              key={value}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tabs;
