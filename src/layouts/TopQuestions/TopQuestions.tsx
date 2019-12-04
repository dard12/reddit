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
  company?: string;
}

function TopQuestions(props: TopQuestionsProps) {
  const { query, tag, tagDocs, company } = props;
  const params = {
    search: { text: query, tags: [tag], companies: [company] },
    sort: 'top',
    pageSize: 5,
  };
  const topics = _.map(tagDocs, ({ id }) => ({ label: id, value: id }));

  topics.unshift({ label: 'All Topics', value: 'all' });

  // const companies = [
  //   { label: 'All Companies', value: 'all' },
  //   { label: 'Netflix', value: 'netflix' },
  //   { label: 'Amazon', value: 'amazon' },
  //   { label: 'Google', value: 'google' },
  //   { label: 'Facebook', value: 'facebook' },
  //   { label: 'Apple', value: 'apple' },
  //   { label: 'Microsoft', value: 'microsoft' },
  //   { label: 'Uber', value: 'uber' },
  //   { label: 'Lyft', value: 'lyft' },
  //   { label: 'Airbnb', value: 'airbnb' },
  // ];

  return (
    <div className={styles.topQuestions}>
      <SearchBar query={query} />

      {/* <Tabs
        tabs={companies}
        currentTab={company}
        queryParamName="company"
        defaultTab="all"
        classNameTabs={styles.companyTabs}
        classNameContainer="none"
        classNameActive={styles.active}
      /> */}

      <MediaQuery minDeviceWidth={768}>
        <Tabs
          tabs={topics}
          currentTab={tag}
          queryParamName="tag"
          defaultTab="all"
          seeMore
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
