import React, { useState } from 'react';
import _ from 'lodash';
import { getQueryParams, setQueryParams } from '../../history';
import styles from './QuestionTabs.module.scss';

interface QuestionTabsProps {
  allTypes: any[];
}

function QuestionTabs(props: QuestionTabsProps) {
  const { allTypes } = props;
  const [type, setType] = useState(getQueryParams('type'));

  const createOnClick = (type: string) => () => {
    setQueryParams({ type });
    setType(type);
  };

  if (!type) {
    const clickAll = createOnClick('response');
    clickAll();
  }

  return (
    <div className={styles.questionTabs}>
      {_.map(allTypes, ({ label, value }) => (
        <div
          onClick={createOnClick(value)}
          className={type === value ? styles.active : undefined}
          key={value}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default QuestionTabs;
