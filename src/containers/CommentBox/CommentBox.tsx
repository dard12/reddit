import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';
import { axios } from '../../App';

interface CommentBoxProps {
  question: number;
}

function CommentBox(props: CommentBoxProps) {
  const { question } = props;
  const [content, setContent] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };

  const onClickPublish = () => {
    if (_.size(_.trim(content)) && !isSubmitting) {
      setIsSubmitting(true);

      axios.post('/api/comment', { question, content }).then(() => {
        setIsSubmitting(false);
        setContent('');
      });
    }
  };

  return (
    <React.Fragment>
      <div className={styles.commentBox}>
        <TextareaAutosize
          placeholder="Write a comment…"
          minRows={3}
          value={content}
          onChange={onChange}
        />
        <div className={styles.commentRow}>
          <Button className="btn" onClick={onClickPublish}>
            Comment
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CommentBox;
