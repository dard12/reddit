import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './QuestionPage.module.scss';
import Comment from '../../containers/Comment/Comment';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';
import { QuestionDoc } from '../../../src-server/models';
import { createDocSelector } from '../../redux/selectors';
import { loadDocsAction } from '../../redux/actions';
import { useLoadDocs, useAxiosGet } from '../../hooks/useAxios';

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

  useLoadDocs({ collection: 'question', result, loadDocsAction });

  const response_count = _.get(questionDoc, 'response_count');
  const meta_count = _.get(questionDoc, 'meta_count');

  return (
    <div className={styles.questionPage}>
      <Question question={question} />

      <div>
        <div className={styles.sectionToggle}>
          <div className="tabs">
            <div className="active">
              <span>Answer Discussion {`(${response_count})`}</span>
            </div>
            <div>
              <span>Meta Discussion {`(${meta_count})`}</span>
            </div>
          </div>
        </div>

        <CommentBox question={question} />
      </div>

      <div>
        <Comment>
          <Comment>
            <Comment />
          </Comment>
          <Comment />
        </Comment>
        <Comment />
        <Comment />
      </div>
    </div>
  );
}

export default connect(
  createDocSelector({
    collection: 'question',
    id: 'question',
    prop: 'questionDoc',
  }),
  { loadDocsAction },
)(QuestionPage);
