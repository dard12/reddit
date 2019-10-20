import React, { useState, useEffect } from 'react';
import qs from 'qs';
import _ from 'lodash';
import { Input } from '../../components/Input/Input';
import styles from './SearchBar.module.scss';
import history, { getQueryParams } from '../../history';

interface SearchBarProps {
  query?: string;
}

function SearchBar(props: SearchBarProps) {
  const { query: initialQuery = '' } = props;
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    submit(event.currentTarget.value);
  };

  const submit = (query: string) => {
    const queryParams = getQueryParams();
    queryParams.query = query;
    const search = qs.stringify(queryParams);

    history.push({ pathname: '/question', search });
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
