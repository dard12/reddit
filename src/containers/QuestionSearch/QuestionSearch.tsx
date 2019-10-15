import React, { useState } from 'react';
import _ from 'lodash';
import styles from './QuestionSearch.module.scss';
import { Input } from '../../components/Input/Input';
import { getQueryParams, setQueryParams } from '../../history';

interface QuestionSearchProps {}

export default function QuestionSearch(props: QuestionSearchProps) {
  const [search, setSearch] = useState(getQueryParams('search'));

  const searchOnChange = _.throttle(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setSearch(value);
      setQueryParams({ search: value });
    },
    500,
  );

  return (
    <Input
      className={styles.searchBar}
      placeholder="Search for a question…"
      onChange={searchOnChange}
      onKeyUp={searchOnChange}
      value={search}
      autoFocus
    />
  );
}
