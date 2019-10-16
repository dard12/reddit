import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './QuestionPage.module.scss';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';
import { QuestionDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import QuestionComments from '../../containers/QuestionComments/QuestionComments';

interface QuestionPageProps {
  question: number;
  questionDoc?: QuestionDoc;
  loadDocsAction?: Function;
}

function QuestionPage(props: QuestionPageProps) {
  const { question, questionDoc, loadDocsAction } = props;
  const { result } = useAxiosGet(
    '/api/question',
    { id: question },
    { cachedResult: questionDoc },
  );

  useLoadDocs({ collection: 'questions', result, loadDocsAction });

  const response_count = _.get(questionDoc, 'response_count');
  const meta_count = _.get(questionDoc, 'meta_count');
  const questionLink = `question/${question}`;

  return (
    <div className={styles.questionPage}>
      <Question question={question} />

      <div>
        <div className={styles.sectionTabs}>
          <div className="tabs">
            <NavLink to={`/${questionLink}/responses`} activeClassName="active">
              <span>Answer Discussion {`(${response_count})`}</span>
            </NavLink>

            <NavLink to={`/${questionLink}/meta`} activeClassName="active">
              <span>Meta Discussion {`(${meta_count})`}</span>
            </NavLink>
          </div>
        </div>

        <CommentBox question={question} />
      </div>

      <QuestionComments question={question} />
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
