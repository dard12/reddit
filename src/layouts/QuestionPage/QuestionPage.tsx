import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './QuestionPage.module.scss';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';
import { QuestionDoc, CommentDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';
import QuestionComments from '../../containers/QuestionComments/QuestionComments';
import QuestionTabs from '../../containers/QuestionTabs/QuestionTabs';
import { getQueryParams } from '../../history';

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
  const allTypes = [
    { label: `Answer Discussion (${response_count})`, value: 'response' },
    { label: `Meta Discussion (${meta_count})`, value: 'meta' },
  ];
  const type = getQueryParams('type');

  return (
    <div className={styles.questionPage}>
      <Question question={question} disableActions />

      <div>
        <QuestionTabs allTypes={allTypes} />
        <CommentBox question={question} type={type} />
      </div>

      <QuestionComments
        question={question}
        type={type}
        rootFilter={(commentDoc: CommentDoc) =>
          commentDoc.id === commentDoc.parent_id &&
          commentDoc.question_id === question &&
          commentDoc.type === type
        }
      />
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
