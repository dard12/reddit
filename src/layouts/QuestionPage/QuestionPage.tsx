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

  return (
    <div className={styles.questionPage}>
      <Question question={question} disableActions />

      <div className={styles.commentSection}>
        <CommentBox question={question} type={type} />
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
