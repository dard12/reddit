import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './QuestionPage.module.scss';
import Comment from '../../containers/Comment/Comment';
import Question from '../../containers/Question/Question';

interface QuestionPageProps {}

function QuestionPage(props: QuestionPageProps) {
  const question = 'What makes a good manager?';
  const description =
    'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.';

  return (
    <div className={styles.postPage}>
      <Question questionDoc={{ question, description }} />

      <div className={styles.responseSection}>
        <div className={styles.heading}>Your Comment</div>
        <div className={styles.commentBox}>
          <TextareaAutosize
            placeholder="What do you think?"
            minRows={5}
            autoFocus
          />
        </div>
        <div className={styles.commentRow}>
          <button className={styles.commentBtn} type="button">
            Comment
          </button>
        </div>
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
