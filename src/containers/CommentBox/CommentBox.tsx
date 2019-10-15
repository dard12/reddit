import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';

interface CommentBoxProps {}

function CommentBox(props: CommentBoxProps) {
  return (
    <React.Fragment>
      <div className={styles.commentBox}>
        <TextareaAutosize placeholder="What do you think?" minRows={5} />

        <div className={styles.commentRow}>
          <Button className={styles.commentBtn}>Comment</Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CommentBox;
