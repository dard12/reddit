import React from 'react';
import styles from './QuestionPage.module.scss';
import Comment from '../../containers/Comment/Comment';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';

interface QuestionPageProps {}

function QuestionPage(props: QuestionPageProps) {
  const question = 'What makes a good manager?';
  const description =
    'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.';

  return (
    <div className={styles.postPage}>
      <Question questionDoc={{ question, description }} />
      <CommentBox />

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
