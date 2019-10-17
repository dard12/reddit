import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';
import { axios } from '../../App';
import { getQueryParams } from '../../history';

interface CommentBoxProps {
  question: number;
  type: 'response' | 'meta';
  parent_id?: number;
  actions?: any;
  afterSubmit?: Function;
}

function CommentBox(props: CommentBoxProps) {
  const { question, type, parent_id, actions, afterSubmit } = props;
  const [content, setContent] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };

  const onClickPublish = () => {
    if (_.size(_.trim(content)) && !isSubmitting) {
      setIsSubmitting(true);

      axios
        .post('/api/comment', {
          question_id: question,
          parent_id,
          content,
          type,
        })
        .then(() => {
          setIsSubmitting(false);
          setContent('');
          afterSubmit && afterSubmit();
        });
    }
  };

  return (
    <React.Fragment>
      <div className={styles.commentText}>
        <TextareaAutosize
          placeholder="Write a comment…"
          minRows={4}
          value={content}
          onChange={onChange}
        />
        <div className={styles.commentAction}>
          {actions}

          <Button className="btn" onClick={onClickPublish}>
            Comment
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CommentBox;
