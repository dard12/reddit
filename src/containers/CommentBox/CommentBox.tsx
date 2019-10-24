import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './CommentBox.module.scss';
import { Button } from '../../components/Button/Button';
import { userSelector } from '../../redux/selectors';
import SignUp from '../../components/SignUp/SignUp';
import { loadDocsAction } from '../../redux/actions';
import { axiosPost } from '../../hooks/useAxios';

interface CommentBoxProps {
  question: string;
  type: 'response' | 'meta';
  user?: string;
  parent_id?: string;
  actions?: any;
  onSubmit?: Function;
  loadDocsAction?: Function;
}

function CommentBox(props: CommentBoxProps) {
  const {
    question,
    type,
    parent_id,
    user,
    actions,
    onSubmit,
    loadDocsAction,
  } = props;
  const [content, setContent] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };

  const onClickPublish = () => {
    if (_.size(_.trim(content)) && !isSubmitting) {
      setIsSubmitting(true);

      axiosPost(
        '/api/comment',
        {
          question_id: question,
          parent_id,
          content,
          type,
        },
        { collection: 'comments', loadDocsAction },
      ).then(({ docs }) => {
        setIsSubmitting(false);
        setContent('');
        onSubmit && onSubmit();
      });
    }
  };

  let placeholder;

  if (parent_id) {
    placeholder = 'Write your reply…';
  } else if (type === 'response') {
    placeholder = 'How would you respond to this question?';
  } else {
    placeholder =
      'Is this a good interview question? What makes this a good or bad question?';
  }

  return (
    <React.Fragment>
      {!user && (
        <div className="card">
          To comment please <SignUp />.
        </div>
      )}

      {user && (
        <React.Fragment>
          <div className={styles.commentText}>
            <TextareaAutosize
              placeholder={placeholder}
              minRows={4}
              value={content}
              onChange={onChange}
            />
          </div>

          <div className={styles.commentAction}>
            {actions}

            <Button className="btn" onClick={onClickPublish}>
              {parent_id ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default connect(
  userSelector,
  { loadDocsAction },
)(CommentBox);
