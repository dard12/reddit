import React, { useState } from 'react';
import qs from 'qs';
import _ from 'lodash';
import { Input } from '../../components/Input/Input';
import styles from './SearchBar.module.scss';
import history, { getQueryParams } from '../../history';

interface SearchBarProps {
  query?: string;
}

const submit = _.throttle((newQuery: string) => {
  const queryParams = getQueryParams();
  queryParams.query = newQuery;
  const search = qs.stringify(queryParams);

  history.push({ pathname: '/questions/top', search });
}, 300);

function SearchBar(props: SearchBarProps) {
  const { query: initialQuery = '' } = props;
  const [query, setQuery] = useState(initialQuery);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.currentTarget.value;
    setQuery(newQuery);
    submit(newQuery);
  };

  return (
    <Input
      className={styles.searchBar}
      placeholder="Search for Interview Questions..."
      onChange={onChange}
      value={query}
    />
  );
}

export default SearchBar;
