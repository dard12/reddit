import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './QuestionPage.module.scss';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';
import { QuestionDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import QuestionComments from '../../containers/QuestionComments/QuestionComments';
import Tabs from '../../containers/Tabs/Tabs';

interface QuestionPageProps {
  question: string;
  type?: any;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function QuestionPage(props: QuestionPageProps) {
  const { question, type, questionDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/question',
    { id: question },
    { name: 'QuestionPage', cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  const response_count = _.get(questionDoc, 'response_count') || 0;
  const meta_count = _.get(questionDoc, 'meta_count') || 0;
  const tabs = [
    { label: `Answer Discussion (${response_count})`, value: 'response' },
    { label: `Meta Discussion (${meta_count})`, value: 'meta' },
  ];

  return (
    <div className={styles.questionPage}>
      <Question question={question} disableActions />

      <div>
        <Tabs
          tabs={tabs}
          queryParamName="type"
          currentTab={type}
          defaultTab="response"
          className={styles.questionTabs}
        />
        <div className={styles.commentSection}>
          <CommentBox question={question} type={type} />
        </div>
      </div>

      <QuestionComments question={question} type={type} />
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'questions',
    id: 'question',
    prop: 'questionDoc',
  }),
  { loadDocsAction },
)(QuestionPage);
