import React from 'react';
import styles from './QuestionPage.module.scss';
import Comment from '../../containers/Comment/Comment';
import Question from '../../containers/Question/Question';
import CommentBox from '../../containers/CommentBox/CommentBox';

interface QuestionPageProps {
  question: number;
}

function QuestionPage(props: QuestionPageProps) {
  const { question } = props;

  return (
    <div className={styles.questionPage}>
      <Question question={question} />

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
