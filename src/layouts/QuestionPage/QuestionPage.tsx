import React from 'react';
import styles from './QuestionPage.module.scss';
import Comment from '../../containers/Comment/Comment';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';
import { QuestionDoc } from '../../../src-server/models';

interface QuestionPageProps {}

function QuestionPage(props: QuestionPageProps) {
  const title = 'What makes a good manager?';
  const description =
    'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.';
  const questionDoc = { title, description } as QuestionDoc;

  return (
    <div className={styles.questionPage}>
      <Question questionDoc={questionDoc} />

      <div>
        <div className={styles.sectionToggle}>
          <div className="tabs">
            <div className="active">
              <span>Answer Discussion (17)</span>
            </div>
            <div>
              <span>Meta Discussion (3)</span>
            </div>
          </div>
        </div>

        <CommentBox />
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

export default QuestionPage;
