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
    <div className={styles.questionPage}>
      <Question questionDoc={{ question, description }} />

      <div>
        <div className={styles.sectionToggle}>
          <div className={styles.sectionTabs}>
            <div className={styles.active}>
              <span>Answers (17)</span>
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
