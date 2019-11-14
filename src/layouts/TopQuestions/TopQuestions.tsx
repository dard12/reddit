import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import MediaQuery from 'react-responsive';
import styles from './TopQuestions.module.scss';
import SearchBar from '../../containers/SearchBar/SearchBar';
import Paging from '../../containers/Paging/Paging';
import QuestionListPage from '../../containers/QuestionListPage/QuestionListPage';
import Tabs from '../../containers/Tabs/Tabs';
import { createDocListSelector } from '../../redux/selectors';
import { TagDoc } from '../../../src-server/models';

interface TopQuestionsProps {
  query?: string;
  tag?: string;
  tagDocs?: TagDoc[];
  tagFilter?: any;
}

function TopQuestions(props: TopQuestionsProps) {
  const { query, tag, tagDocs } = props;
  const params = {
    search: { text: query, tags: [tag] },
    sort: 'up_votes',
  };
  const tabs = _.map(tagDocs, ({ id }) => ({ label: id, value: id }));

  tabs.unshift({ label: 'All', value: 'all' });

  return (
    <div className={styles.topQuestions}>
      <SearchBar query={query} />

      <MediaQuery minDeviceWidth={768}>
        <Tabs
          tabs={tabs}
          currentTab={tag}
          queryParamName="tag"
          defaultTab="all"
        />
      </MediaQuery>

      <Paging component={QuestionListPage} params={params} />
    </div>
  );
}

export default connect(
  createDocListSelector({
    collection: 'tags',
    filter: 'tagFilter',
    prop: 'tagDocs',
    orderBy: ['priority', 'desc'],
  }),
)(TopQuestions);
