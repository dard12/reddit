import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';
import { axios } from '../../App';

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

  let placeholder;

  if (parent_id) {
    placeholder = 'Write your reply';
  } else if (type === 'response') {
    placeholder = 'How would you respond to this question?';
  } else {
    placeholder =
      'Is this a good interview question? What makes this a good or bad question?';
  }

  return (
    <React.Fragment>
      <div className={styles.commentText}>
        <TextareaAutosize
          placeholder={placeholder}
          minRows={2}
          value={content}
          onChange={onChange}
        />
        <div className={styles.commentAction}>
          {actions}

          <Button className="btn" onClick={onClickPublish}>
            {parent_id ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CommentBox;
